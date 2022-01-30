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
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SKButton from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import SKInput from '../components/SKInput';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import {forgotPassword} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import * as CustomFonts from '../constants/FontsDefs'

const ForgotPasswordNew = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [secCode, setSecCode] = useState('');
  const [codeSentSuccessfully, setCodeSentSuccessfully] = useState(false);
  const {params} = props?.route;
  const {pagetitle, pagesubs} = params;
  const [otp, setOtp] = useState();  
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled={codeSentSuccessfully}
        style={{flex: 1, width: '100%', paddingBottom: 10}}
        keyboardVerticalOffset={0}>
        {isLoading && <SKLoader />}
        <AppHeader navigation={navigation} />
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <View style={{width: '100%', marginTop: 86}}>
            <Heading value={pagetitle} marginTop={0} />
            <Heading
              fontSize={16}
              marginTop={30}
              fontWeight="700"
              color={Colors.BLACK}
              value={
                'WE WILL SEND A CODE TO YOUR EMAIL. PLEASE PROVIDE US YOUR EMAIL'
              }
            />
          </View>
          <SKInput
            marginTop={36}
            marginBottom={0}
            leftAccImage={CustomFonts.Email}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={email}
            placeholder="Email"
            autoCapitalize = 'none'
            onEndEditing={value => {
              setEmail(value);
            }}
          />
          <SKButton
            fontSize={16}
            marginTop={36}
            width={'100%'}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'Submit'}
            onPress={() => {
              Keyboard.dismiss();
              const isEmailValid = Validator.isValidField(
                email,
                ST_REGEX.Email,
              );
              if (isEmailValid) {
                setIsLoading(true);
                const val = Math.floor(1000 + Math.random() * 9000);
                const params = {SecurityCode: val, Email: email};
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
              } else {
                Alert.alert('SukhTax', 'Please enter valid a email address.');
              }
            }}
          />
          {codeSentSuccessfully && 
          <>
          <Heading
            fontSize={16}
            marginTop={30}
            fontWeight="700"
            color={Colors.BLACK}
            value={pagesubs}
          />
          <View
            style={{
              marginTop: 27,
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
              keyboardType="number-pad"
              placeholder="Enter OTP"
              onEndEditing={value => {
                setOtp(value);
              }}
            />
          </View>
          <SKButton
            fontSize={16}
            marginTop={45}
            width={'100%'}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'Submit'}
            onPress={() => {
              if (Number.isNaN(otp) || otp.length < 4) {
                Alert.alert('SukhTax', 'Please enter a valid Security Code.');
              }else if (otp == `${secCode}`) {
                navigation.navigate('SetupNewPass');
              } else {
                Alert.alert(
                  'SukhTax',
                  'Please enter a valid OTP sent on your mail.',
                );
              }
            }}
          />
          <SKButton
            fontSize={16}
            width={'100%'}
            marginTop={19}
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'Resend Code'}
            onPress={() => {
              const val = Math.floor(1000 + Math.random() * 9000);
              const params = {SecurityCode: val, Email: email};
              setIsLoading(true);
              forgotPassword(params, forgetPassRes => {
                setIsLoading(false);
                if (forgetPassRes?.forgetPassRes == 1) {
                  const data = forgetPassRes && forgetPassRes.data[0];
                  SKTStorage.storeUserData(data, savedRes => {
                    setSecCode(val);
                    setCodeSentSuccessfully(true);
                    setIsLoading(false);
                  });
                } else {
                  const msg =
                    forgetPassRes?.message ??
                    'Something went wront, Please try again later.';
                  Alert.alert('SukhTax', msg);
                }
              });
            }}
          />
          </>
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordNew;

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
