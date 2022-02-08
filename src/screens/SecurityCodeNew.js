import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SKButton from '../components/SKButton';
import AppHeader from '../components/AppHeader';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import SKInput from '../components/SKInput';
import * as Colors from '../constants/ColorDefs';
import {userCheckOtpForLogin,forgotPassword} from '../apihelper/Api'
import * as CustomFonts from '../constants/FontsDefs';


const SecurityCodeNew = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {params} = props?.route;
  const {pagetitle,pagesubs,email} = params
  const [otp, setOtp] = useState();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
        justifyContent: 'flex-start',
      }}>
      {isLoading && <SKLoader/>}
      <AppHeader navigation = {navigation}/>
      <ScrollView
        contentContainerStyle={{width: '100%', paddingHorizontal: 30}}>
        <Heading value={pagetitle} marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          fontWeight="700"
          color={Colors.BLACK}
          value={pagesubs}
        />
        <View
          style={{
            marginTop: 40,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <SKInput
              marginTop={10}
              maxLength={4}
              borderColor={Colors.CLR_0065FF}
              value={otp}
              textAlign = {'center'}
              fontSize = {20}
            //   fontWeight = {'bold'}        
              keyboardType="number-pad"
              placeholder="Enter OTP"
              onEndEditing={value => {
                setOtp(value);
              }}
            />
        </View>
        <SKButton
          fontSize={16}
          marginTop={40}
          width={'100%'}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            Keyboard.dismiss()
            if (Number.isNaN(otp) || otp.length < 4) {
              Alert.alert('SukhTax', 'Please enter a valid OTP');
            }else{
              const {user_id} = global.userInfo
              if(user_id){
                setIsLoading(true)
                const params = {user_id:user_id,OTP:otp}
                userCheckOtpForLogin(params,(checkOtpRes)=>{
                  setIsLoading(false)
                  if (checkOtpRes?.status == 1) {
                    navigation.navigate('Login')  
                  }else {
                    const msg =
                    checkOtpRes?.message ??
                      'Something went wront, Please try again later.';
                    Alert.alert('SukhTax', msg);
                  }
                })
              }else{
                Alert.alert('SukhTax', 'Please retry, We are facing some technical glitch.');
              }
            }
          }}
        />
        <SKButton
          fontSize={16}
          width={'100%'}
          marginTop={20}
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_F58080}
          borderColor={Colors.CLR_EB0000}
          title={'Resend Code'}
          onPress={() => {
            const val = Math.floor(1000 + Math.random() * 9000);
            const params = {SecurityCode:val,Email:email}
            setIsLoading(true)
            forgotPassword(params, fRes => {
              setIsLoading(false);
              if (fRes?.status == 1) {
                const data = fRes.data[0];
                SKTStorage.storeUserData(data, savedRes => {
                  setSecCode(val);
                  setCodeSentSuccessfully(true);
                });
              } else {
                const msg =
                  fRes?.message ??
                  'Something went wront, Please try again later.';
                Alert.alert('SukhTax', msg);
              }
            }); 
          }}
        />
      </ScrollView>
    </View>
  );
};

export default SecurityCodeNew;

const styles = StyleSheet.create({
  otpInput: {
    width: 56,
    marginHorizontal: 8,
    textAlign: 'center',
    fontSize: 16,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: Colors.LIGHTGRAY,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    shadowOpacity: 1.0,
  },
});
