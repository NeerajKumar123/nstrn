import {
    CardField,
    useStripe,
    useConfirmPayment,
  } from '@stripe/stripe-react-native';
  import React, {useState, useEffect} from 'react';
  import {
    TouchableOpacity,
    View,
    Alert,
    ScrollView,
    Image,
    DeviceEventEmitter,
    Keyboard,
    Platform,
  } from 'react-native';
  import SKButton, {Link} from '../components/SKButton';
  import {stripeAPIVersion} from '../constants/StaticValues'
  import SKLoader from '../components/SKLoader';
  import * as Colors from '../constants/ColorDefs';
  import {useNavigation} from '@react-navigation/native';
  import {
    taxDocsGenerateEphemeralKey,
    taxDocsSubmitPayment,
    taxDocsSavePaymentInfo,
    taxDocsGetTaxDocsStatus,
    taxDocsFinalizeProcess
  } from '../apihelper/Api';
  import * as SKTStorage from '../helpers/SKTStorage';
  import * as CustomFonts from '../constants/FontsDefs';
  import AppHeader from '../components/AppHeader';

  const RequestPaymentScreen = props => {
    const navigation = useNavigation();
    const pageParams = props.route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [card, setCard] = useState(undefined);
    const {confirmPayment, loading} = useConfirmPayment();
  
    useEffect(() => {
      fetchPaymentIntentClientSecret();
    }, []);
  
    const fetchPaymentIntentClientSecret = async () => {
      setIsLoading(true);
      const {user_id, tax_docs_id,Stripe_Customer_Id} = global.taxDocsStatusData;
      const params = {
        User_Id: user_id,
        Tax_Docs_Id: tax_docs_id,
        Stripe_Customer_Id: Stripe_Customer_Id,
        API_Version: stripeAPIVersion,
      };
      taxDocsGenerateEphemeralKey(params, res => {
        const intentParams = {
          User_Id: user_id,
          Tax_Docs_Id: tax_docs_id,
          Stripe_Customer_Id: Stripe_Customer_Id,
          Payable_Amount: pageParams?.payment_required,
          Currency: 'CAD',
        };
        taxDocsSubmitPayment(intentParams, intentRes => {
          const {client_secret} = intentRes;
          setClientSecret(client_secret);
          setIsLoading(false);
        });
      });
    };
  
    const handlePayPress = async () => {
      // Gather the customer's billing information (e.g., email)
      const {mailing_address, user_email, user_mobile} = global.taxDocsStatusData;
      const billingDetails = {
        email: user_email,
        mailing_address: mailing_address,
        user_mobile: user_mobile,
      };
      setIsLoading(true);
      // Confirm the payment with the card details
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        billingDetails,
      });
      if (error) {
        setIsLoading(false);
        Alert.alert('SukhTax', 'We are facing some techinical glitch , Please try again.');
      } else if (paymentIntent) {
        const {id,status} = paymentIntent
        const {user_id, tax_docs_id} = global.taxDocsStatusData;
        const params = {User_Id:user_id,Tax_Docs_Id:tax_docs_id,Payment_Intent_id:id,Payment_Status:status}
        taxDocsSavePaymentInfo(params, (savePaymentRes)=>{
          if(savePaymentRes?.status == 1){
            const params = {User_Id:user_id,Tax_Docs_Id:tax_docs_id}
            taxDocsFinalizeProcess(params,(finalRes)=>{
              if(finalRes?.status == 1){
                const paramsStatus = {User_Id:user_id}
                taxDocsGetTaxDocsStatus(paramsStatus,(taxDocsRes) =>{
                  if(taxDocsRes?.status == 1){
                    setIsLoading(false);
                    const taxDocsStatusData = taxDocsRes?.data && taxDocsRes?.data.length > 0 ? taxDocsRes?.data[0] : undefined
                    global.taxDocsStatusData = taxDocsStatusData
                    setTimeout(() => {
                      navigation.navigate('RequestApplyStatus', {shouldGoToHome:true})
                    }, 200);
                  }else{
                    setIsLoading(false);
                    const msg = incStatusRes?.message ?? 'Something went wront, Please try again later.'
                    Alert.alert('SukhTax',msg)
                  }
                })
              }else{
                setIsLoading(false);
                const msg = incStatusRes?.message ?? 'Something went wront, Please try again later.'
                Alert.alert('SukhTax',msg)

              }
            }) 
          }else{
            setIsLoading(false);
            const msg = savePaymentRes?.message ?? 'Something went wront, Please try again later.'
            Alert.alert('SukhTax',msg)
          }
        })
      }
    };
  
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
        }}>
        <AppHeader navigation={navigation} />
        {isLoading && <SKLoader />}
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}>
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
            }}
            onCardChange={cardDetails => {
              setCard(cardDetails);
            }}
          />
          <SKButton
            fontSize={16}
            marginTop={30}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'PAY NOW'}
            onPress={() => {
              Keyboard.dismiss();
              if (card?.complete) {
                handlePayPress();
              }else{
                Alert.alert('SukhTax', 'Please fill up the complete card details.')
              }
            }}
          />
        </View>
      </View>
    );
  };
  
  export default RequestPaymentScreen;
  