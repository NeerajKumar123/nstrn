import React, { useState } from 'react';
import {TouchableOpacity, View, Alert, ScrollView, Image, Keyboard,Platform} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues'
import {resetPassword} from '../apihelper/Api'
const passicon = require('../../assets/pass.png');
const header_logo = require('../../assets/header_logo.png');

const SetupNewPass = props => {
  const navigation = useNavigation()
  const [pass, setPass] = useState('')
  const [cPass, setCPass] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    let isValidForm = true;
    const isPassValid =  Validator.isValidField(pass, ST_REGEX.Password)
    const isCPassValid =  Validator.isValidField(cPass, ST_REGEX.Password)
    if(!isPassValid){
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid Password');
    }else if(!isCPassValid){
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid Confirm Password');
    }else if(pass != cPass){
      isValidForm = false;
      Alert.alert('AppDisplayName','Passwords mismatch');
    }
    return isValidForm;
  };

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      {isLoading && <SKLoader/>}
      <Header />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          flex: 1,
        }}>
        <Heading value="NEW PASSWORD" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          fontWeight = '700'
          color={Colors.BLACK}
          value="ENTER A NEW PASSWORD ONE THAT
          YOU CAN REMEMBER"
        />
        <SKInput
          marginTop={48}
          marginBottom={0}
          maxLength = {6}
          leftAccImage={passicon}
          borderColor={Colors.CLR_0065FF}
          value={pass}
          placeholder = 'Password'
          onEndEditing={value => {
            setPass(value)
          }}
        />
        <SKInput
          leftAccImage={passicon}
          marginBottom={0}
          maxLength = {6}
          borderColor={Colors.CLR_0065FF}
          value={cPass}
          placeholder = 'Confirm Password'
          onEndEditing={value => {
            setCPass(value)
          }}
        />
        <SKButton
          fontSize={16}
          marginTop={31}
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
          title={'Submit'}
          onPress={() => {
            Keyboard.dismiss()
            if(checkFormValidations()){
              const userid = global.userInfo?.user_id
              if(userid){
                setIsLoading(true)
                const params = {user_id:userid, 'New_Password':pass}
                resetPassword(params, (res) =>{
                setIsLoading(false)
                if(res?.status == 1){
                  navigation.navigate('Login')
                }else{
                  const msg = res?.message ?? 'Something went wront, Please try again later.'
                  Alert.alert('SukhTax',msg)
                }
                })
              }
            }
          }}
        />
      </ScrollView>
    </View>
  );
};

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

export default SetupNewPass;
