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
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import {userCheckOtpForLogin,forgotPassword} from '../apihelper/Api'
const header_logo = require('../../assets/header_logo.png');

const SecurityCode = props => {
  const navigation = useNavigation();
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = Array(4).fill(0);
  const {params} = props?.route;
  console.log('params',params)
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
      <Header />
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
          {inputs.map((i, j) => (
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
                  color: Colors.GREEN,
                  borderColor: getRef(j).current?.isFocused()
                    ? Colors.CLR_F58080
                    : Colors.LIGHTGRAY,
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
          width={305}
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
          title={'Submit'}
          onPress={() => {
            Keyboard.dismiss()
            const otp = _otp;
            if (Number.isNaN(otp) || otp.length < 4) {
              Alert.alert('SukhTax', 'Please enter a valid OTP');
            }else{
              const userid = global.userInfo?.user_id
              if(userid){
                setIsLoading(true)
                const params = {user_id:userid,OTP:otp}
                userCheckOtpForLogin(params,()=>{
                  navigation.navigate('Login')  
                  setIsLoading(false)
                })
              }
            }
          }}
        />
        <SKButton
          fontSize={16}
          width={305}
          marginTop={20}
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_F58080}
          borderColor={Colors.CLR_EB0000}
          title={'Resend Code'}
          onPress={() => {
            const val = Math.floor(1000 + Math.random() * 9000);
            const params = {SecurityCode:val,Email:email}
            setIsLoading(true)
            forgotPassword(params,(res) =>{
                const data = res.data[0]
                SKTStorage.storeUserData(data, (savedRes) =>{
                  console.log('data',data)
                  setSecCode(val)
                  setCodeSentSuccessfully(true)  
                  setIsLoading(false)
                });
            }) 
          }}
        />
      </ScrollView>
    </View>
  );
};

export default SecurityCode;

const Header = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? 44 : 10,
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
        onPress={() => {
          props.onLeftPress && props.onLeftPress();
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 38,
            height: 38,
          }}
          source={header_logo}
        />
      </TouchableOpacity>
    </View>
  );
};

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
