import React, { useState } from 'react';
import {TouchableOpacity, View, Alert, ScrollView, Image, Keyboard,Platform} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader'
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import {useNavigation} from '@react-navigation/native';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues'
import {resetPassword} from '../apihelper/Api'

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
      Alert.alert('SukhTax','Please enter valid Password');
    }else if(!isCPassValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid Confirm Password');
    }else if(pass != cPass){
      isValidForm = false;
      Alert.alert('SukhTax','Passwords mismatch');
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
      <AppHeader navigation = {navigation}/>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          flex: 1,
        }}>
        <Heading value="NEW PASSWORD" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={35}
          fontWeight = '700'
          color={Colors.BLACK}
          value="ENTER A NEW PASSWORD ONE THAT
          YOU CAN REMEMBER"
        />
        <SKInput
          marginTop={17}
          marginBottom={0}
          maxLength = {16}
          leftAccImage={CustomFonts.Lock}
          borderColor={Colors.CLR_0065FF}
          value={pass}
          placeholder = 'Password'
          onEndEditing={value => {
            setPass(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Lock}
          marginBottom={0}
          maxLength = {16}
          marginTop={10}
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
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            Keyboard.dismiss()
            if(checkFormValidations()){
              const {user_id} = global.userInfo
              if(userid){
                setIsLoading(true)
                const params = {user_id:user_id, 'New_Password':pass}
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


export default SetupNewPass;
