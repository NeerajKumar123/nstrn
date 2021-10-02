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
import * as Colors from '../constants/ColorDefs';
import {userCheckOtpForLogin,forgotPassword} from '../apihelper/Api'

const SecurityCode = props => {
  const navigation = useNavigation();
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = Array(4).fill(0);
  const {params} = props?.route;
  const {pagetitle,pagesubs,email} = params
  const [otpParams, setOtpParams] = useState(params);
  const [otps, setOtps] = useState(Array(4).fill(''));
  const [_otp, set_otp] = useState('');

  const autoPopulate = finalOTP => {
    let str = finalOTP.trim();
    if (str.length !== 4) {
      return;
    }
    str = str.split('');
    if (input1 && input1.current && str[0]) {
      input1.current.setNativeProps({text: str[0]});
    }
    if (input2 && input2.current && str[1]) {
      input2.current.setNativeProps({text: str[1]});
    }
    if (input3 && input3.current && str[2]) {
      input3.current.setNativeProps({text: str[2]});
    }
    if (input4 && input4.current && str[3]) {
      input4.current.setNativeProps({text: str[3]});
      input4.current.focus();
    }
  };

  const focusNext = (index, value) => {
    if (!value || String(value).trim().length === 0 || Number.isNaN(value)) {
      return;
    }
    if (!Number.isInteger(Number(value))) {
      getRef(index).current.clear();
      return;
    }
    if (index < 3) {
      getRef(index + 1).current.focus();
    }

    const _otps = otps;
    _otps[index] = value;
    setOtps(_otps);
    set_otp(_otps.join(''));
    const otp = _otps.join('');
    if (otp.length === 4) {
      Keyboard.dismiss();
    }

    if (index === 3 && otp.length === 4) {
      input4.current.blur();
    }
  };

  const getRef = index => {
    switch (index) {
      case 0:
        return input1;
      case 1:
        return input2;
      case 2:
        return input3;
      case 3:
        return input4;
    }
  };

  const focusPrevious = (key, index) => {
    if (key === 'Backspace' && index > 0) {
      if (otps[index]) {
        getRef(index).current.clear();
        const _otps = otps;
        _otps[index] = '';
        setOtps(_otps);
      } else {
        getRef(index - 1).current.focus();
      }
    }
  };

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
          {inputs?.map((i, j) => (
            <TextInput
              key={`${j}_Input_Key`}
              ref={getRef(j)}
              underlineColorAndroid={Colors.TRANS}
              keyboardType="number-pad"
              textContentType="none"
              autoCorrect={false}
              placeholder=""
              style={[
                styles.otpInput,
                {
                  color: Colors.BLACK,
                  borderColor: getRef(j).current?.isFocused()
                    ? Colors.CLR_F58080
                    : Colors.CLR_00000020,
                },
              ]}
              clearTextOnFocus={false}
              // autoFocus={j === 0}
              maxLength={Platform.OS === 'ios' ? 4 : 1}
              numberOfLines={1}
              selectionColor={Colors.WHITE}
              onChangeText={v => {
                if (v.length === 4 && Platform.OS === 'ios') {
                  autoPopulate(v);
                } else {
                  focusNext(j, v);
                }
              }}
              returnKeyType="next"
              accessible={true}
              accessibilityLabel="OTP"
              onChange={e => {}}
              onKeyPress={e => focusPrevious(e.nativeEvent.key, j)}
            />
          ))}
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
            const otp = _otp;
            if (Number.isNaN(otp) || otp.length < 4) {
              Alert.alert('SukhTax', 'Please enter a valid OTP');
            }else{
              const {user_id} = global.userInfo
              if(user_id){
                setIsLoading(true)
                const params = {user_id:user_id,OTP:otp}
                userCheckOtpForLogin(params,(checkOtpRes)=>{
                  console.log('checkOtpRes',checkOtpRes)
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

export default SecurityCode;

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
