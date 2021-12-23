import React, {useState, useEffect} from 'react';
import {Alert, View, Text, ScrollView,TextInput,} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import {incorpGetPaymentDetails,aplyRefCodeIncorp} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';

import Lottie from 'lottie-react-native';
const loader = require('../../assets/loader.json');

const IncorpPaymentDetails = props => {
  const [isPaynow, setIsPaynow] = useState(false);
  const [status, setStatus] = useState(1);
  const [payments, setPayments] = useState()
  const [total, setTotal] = useState()
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefCodeApplied, setIsRefCodeApplied] = useState(false)
  const [refCodeAppliedMsg, setRefCodeAppliedMsg] = useState('');
  const [refCode, setRefCode] = useState();
  const [isApplying, setIsApplying] = useState(false);


  useEffect(() => {
    getUpdatedDetails()
  }, [])

  const getUpdatedDetails = () =>{
    setIsLoading(true)
    const {incorporation_id, user_id} = global.incStatusData
    const params = {User_id:user_id,Incorporation_Id:incorporation_id}
    incorpGetPaymentDetails(params, (paymentDetailsRes) =>{
      setIsLoading(false)
      if(paymentDetailsRes?.status == 1){
        setPayments(paymentDetailsRes?.data)
        let f = 0
        paymentDetailsRes?.data?.map((item) =>{
          f = f + (item.amount != null ? item.amount : 0)
        })
        setTotal(f)
      }else{
        const msg = paymentDetailsRes?.message ?? 'Something went wront, Please try again later.'
        Alert.alert('SukhTax',msg)
      }
    })
  }

  
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation = {navigation}/>
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="PAYMENTS" marginTop={100} />
        <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="PLEASE COMPLETE THE BELOW PAYMENT TO FINALIZE YOUR REGISTRATION REQUEST:"
      />
      {payments &&
          payments.map((item, index) => {
            if(item.item_name){
              return (
                <KeyValueView key = {item.item_name} marginTop={index == 0 ? 40 : 20} title={item.item_name} value={`$${item.amount}`} />
              );
            }
          })}
      <View
        style={{
          marginVertical: 20,
          height: 2,
          backgroundColor: Colors.CLR_00000020,
          width: '100%',
        }}
      />
      <KeyValueView marginTop={12} title="TOTAL" value={`$${total}`} />
      {!isRefCodeApplied ? (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
            marginTop:40
          }}>
          <TextInput
            style={{
              fontSize: 17,
              fontFamily: CustomFonts.OpenSansRegular,
              fontWeight: '700',
              height: 45,
              flex: 1,
              color: Colors.BLACK,
              backgroundColor: Colors.WHITE,
              borderBottomWidth:1,
              borderBottomColor:Colors.GREY
            }}
            textAlign={'left'}
            underlineColorAndroid="transparent"
            value={refCode}
            keyboardType={'default'}
            autoCompleteType="off"
            autoCorrect={false}
            placeholderTextColor={Colors.CLR_9B9EA1}
            placeholder="Referral Code"
            maxLength={20}
            returnKeyType="done"
            onFocus={() => {
            }}
            onChangeText={value => {
              setRefCode(value);
            }}
            onBlur={() => {}}
            onEndEditing={() => {
              const finalValue = refCode?.trim() || '';
              console.log('finalValue====>', finalValue);
            }}
          />
          {isApplying && (
            <Lottie
              style={{width: 35, height: 35}}
              autoPlay
              loop
              source={loader}
            />
          )}
          {!isApplying && (
            <SKButton
              fontSize={14}
              height={40}
              width="25%"
              marginLeft={20}
              fontWeight={'normal'}
              borderColor = {Colors.WHITE}
              backgroundColor={Colors.APP_BLUE_HEADING_COLOR}
              title={'APPLY'}
              onPress={() => {
                if (refCode?.length > 1) {
                  setIsApplying(true);
                  const {incorporation_id, user_id} = global.incStatusData
                  const params = {
                    User_id: user_id,
                    Incorporation_Id: incorporation_id,
                    Referral_Code: refCode,
                  };
                  aplyRefCodeIncorp(params, res => {
                    setIsApplying(false);
                    if (res?.status == 1) {
                      setRefCodeAppliedMsg(res?.message)
                      setIsRefCodeApplied(true)
                      getUpdatedDetails()
                    } else {
                      Alert.alert('Sukhtax', res?.message);
                    }
                  });
                } else {
                  Alert.alert('Sukhtax', 'Please enter valid referral code.');
                }
              }}
            />
          )}
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 15,
              fontStyle: 'italic',
              color: Colors.APP_RED_SUBHEADING_COLOR,
            }}>
            {refCodeAppliedMsg}
          </Text>
        </View>
      )}
        <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'PAY NOW'}
        onPress={() => {
          const nextPageParams = {payment_required:total}
          navigation.navigate('IncorpPaymentScreen',{...nextPageParams})    
        }}
      />
      <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text
            style={{
              width: '60%',
              textAlign: 'center',
              color: Colors.BLACK,
              fontSize: 12,
              fontFamily: CustomFonts.OpenSansRegular,
            }}>
            DON'T WORRY ALL PAYMENTS ARE SECURED
          </Text>
        </View>
    </ScrollView>
    </View>
  );
};

const KeyValueView = props => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: props.marginTop,
      }}>
      <Text style={{fontWeight: '700', fontSize: 20, color: Colors.APP_BLUE_HEADING_COLOR}}>
        {props.title}
      </Text>
      <Text style={{fontWeight: '700', fontSize: 20, color: Colors.APP_BLUE_HEADING_COLOR}}>
        {props.value}
      </Text>
    </View>
  );
};

export default IncorpPaymentDetails;
