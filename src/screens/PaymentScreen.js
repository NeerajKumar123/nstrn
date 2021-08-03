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
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {
  stripeGenerateEphemeralKey,
  stripeSubmitPayment,
  onlineSavePaymentInfo,
} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import * as CustomFonts from '../constants/FontsDefs';
import AppHeader from '../components/AppHeader';
const PaymentScreen = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  console.log('BankingAndMore pageParams', pageParams);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [card, setCard] = useState(undefined);
  const {confirmPayment, loading} = useConfirmPayment();

  useEffect(() => {
    fetchPaymentIntentClientSecret();
  }, []);

  const fetchPaymentIntentClientSecret = async () => {
    setIsLoading(true);
    const {Stripe_Customer_Id, user_id, tax_file_id} = global.userInfo;
    const params = {
      User_Id: user_id,
      Tax_File_Id: tax_file_id || 3127,
      Stripe_Customer_Id: Stripe_Customer_Id,
      API_Version: '2020-08-27',
    };
    stripeGenerateEphemeralKey(params, res => {
      console.log('params', res);
      const intentParams = {
        User_Id: user_id,
        Tax_File_Id: tax_file_id || 3127,
        Stripe_Customer_Id: Stripe_Customer_Id,
        Payable_Amount: pageParams?.payment_required + pageParams?.additional_payment_required,
        Currency: 'CAD',
      };
      stripeSubmitPayment(intentParams, intentRes => {
        console.log('intentRes', intentRes);
        const {client_secret} = intentRes;
        setClientSecret(client_secret);
        setIsLoading(false);
      });
    });
  };

  const handlePayPress = async () => {
    // Gather the customer's billing information (e.g., email)
    const {mailing_address, user_email, user_mobile} = global.statusData;
    const billingDetails = {
      email: user_email,
      mailing_address: mailing_address,
      user_mobile: user_mobile,
    };
    // Confirm the payment with the card details
    const {paymentIntent, error} = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails,
    });
    if (error) {
      setIsLoading(false);
      console.log('Payment confirmation error', error);
    } else if (paymentIntent) {
      setIsLoading(false);
      Alert.alert('SukhTax', 'Payment done successfully!');
      navigation.popToTop();
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
            console.log('cardDetails', cardDetails);
            setCard(cardDetails);
          }}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          leftAccImage={CustomFonts.Email}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={address}
          placeholder="Address"
          onEndEditing={value => {
            setAddress(value);
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
            console.log('card', card);
            if (card) {
              Keyboard.dismiss();
              handlePayPress();
            }
          }}
        />
      </View>
    </View>
  );
};

export default PaymentScreen;
