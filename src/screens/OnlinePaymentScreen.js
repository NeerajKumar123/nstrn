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
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {stripeAPIVersion} from '../constants/StaticValues'
import {
  stripeGenerateEphemeralKey,
  stripeSubmitPayment,
  onlineSavePaymentInfo,
} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import * as CustomFonts from '../constants/FontsDefs';
import AppHeader from '../components/AppHeader';
const OnlinePaymentScreen = props => {
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
    const {Stripe_Customer_Id, user_id,tax_file_id} = global.onlineStatusData
    const params = {
      User_Id: user_id,
      Tax_File_Id: tax_file_id,
      Stripe_Customer_Id: Stripe_Customer_Id,
      API_Version: stripeAPIVersion,
    };
    stripeGenerateEphemeralKey(params, res => {
      const intentParams = {
        User_Id: user_id,
        Tax_File_Id: tax_file_id,
        Stripe_Customer_Id: Stripe_Customer_Id,
        Payable_Amount: pageParams?.payment_required + pageParams?.additional_payment_required,
        Currency: 'CAD',
      };
      stripeSubmitPayment(intentParams, intentRes => {
        const {client_secret} = intentRes;
        setClientSecret(client_secret);
        setIsLoading(false);
      });
    });
  };

  const handlePayPress = async () => {
    // Gather the customer's billing information (e.g., email)
    const {mailing_address, user_email, user_mobile} = global.onlineStatusData;
    const billingDetails = {
      email: user_email,
      mailing_address: mailing_address,
      user_mobile: user_mobile,
    };
    setIsLoading(true);
    // Confirm the payment with the card details
    const {paymentIntent, error} = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails,
    });
    if (error) {
      setIsLoading(false);
      Alert.alert('SukhTax', 'We are facing some techinical glitch , Please try again.');
    } else if (paymentIntent) {
      const {id,status} = paymentIntent
      const {user_id,tax_file_id} = global.onlineStatusData;
      const params = {User_Id:user_id,Tax_File_Id:tax_file_id,Payment_Intent_id:id,Payment_Status:status,Additional_Payment:pageParams?.additional_payment_required > 0 ? 1 : 0 }
      onlineSavePaymentInfo(params, (savePaymentRes)=>{
        setIsLoading(false);
        if(savePaymentRes?.status == 1){
          SKTStorage.setKeyValue('selectedYears',[],()=>{
            navigation.navigate('Home');
          setTimeout(() => {
            const msg = savePaymentRes?.message ? savePaymentRes?.message : 'Payment done successfully.'
            Alert.alert('SukhTax', msg);  
          }, 200);
          })
        }else{
          setTimeout(() => {
            const errormsg = savePaymentRes?.message ? savePaymentRes?.message : 'We are facing some techinical glitch , Please try again.'
            Alert.alert('SukhTax', errormsg);
            }, 200);
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

export default OnlinePaymentScreen;
