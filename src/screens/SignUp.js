import React, {useState} from 'react';
import {TouchableOpacity, View, Alert, ScrollView, Image,Keyboard,Platform, KeyboardAvoidingView} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues'
import * as Colors from '../constants/ColorDefs';
import {register} from '../apihelper/Api'
const back_arrow = require('../../assets/back_arrow.png');
const usericon = require('../../assets/username.png');
const  emailicon = require('../../assets/email.png');
const phoneicon = require('../../assets/phone.png');
const passicon = require('../../assets/pass.png');
const hideicon = require('../../assets/hide.png');

const SignUp = props => {
  const navigation = useNavigation()
  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [pass, setPass] = useState('')
  const [cPass, setCPass] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid =  Validator.isValidField(fName, ST_REGEX.FName)
    const isLNameValid =  Validator.isValidField(lName, ST_REGEX.LName)
    const isEmailValid =  Validator.isValidField(email, ST_REGEX.Email)
    const isMobileValid =  Validator.isValidField(mobile, ST_REGEX.Mobile)
    const isPassValid =  Validator.isValidField(pass, ST_REGEX.Password)
    const isCPassValid =  Validator.isValidField(cPass, ST_REGEX.Password)

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid First Name');
    }else if(!isLNameValid){
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid Last Name');
    }else if(!isEmailValid){
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid Email Address');
    }else if(!isMobileValid){
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid Phone Number');
    }else if(!isPassValid){
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
        flex:1
      }}>
      {isLoading && <SKLoader/>}
      <AppHeader
        onLeftPress={() => {
          console.log('AppHeader');
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={'position'}
        enabled={true}
        style={{backgroundColor: Colors.WHITE, flex: 1}}
        keyboardVerticalOffset={-200}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          flex: 1,
        }}>
        <Heading value="LETS LOG IN" marginTop={26} />
        <Heading
          fontSize={16}
          marginTop={45}
          color={Colors.BLACK}
          value="LETS GET TO KNOW YOU BETTER"
        />
        <SKInput
          marginTop={26}
          marginBottom={0}
          maxLength = {15}
          leftAccImage={usericon}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'First Name'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setFName(value)
          }}
        />
        <SKInput
          leftAccImage={usericon}
          marginBottom={0}
          maxLength = {15}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder = 'Last Name'
          onEndEditing={value => {
            setLName(value)
          }}
        />
        <SKInput
          leftAccImage={emailicon}
          marginBottom={0}
          maxLength = {30}
          borderColor={Colors.CLR_0065FF}
          value={email}
          placeholder = 'Email Address'
          onEndEditing={value => {
            setEmail(value)
          }}
        />
        <SKInput
          leftAccImage={phoneicon}
          marginBottom={0}
          maxLength = {10}
          borderColor={Colors.CLR_0065FF}
          value={mobile}
          placeholder = 'Phone Number'
          onEndEditing={value => {
            setMobile(value)
          }}
        />
        <SKInput
          leftAccImage={passicon}
          marginBottom={0}
          maxLength = {6}
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
          rightAccImage={hideicon}
          maxLength = {6}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Confirm Password'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setCPass(value)
          }}
        />
        <SKButton
          fontSize={16}
          marginTop={33}
          width = '100%'
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
          title={'Continue'}
          onPress={() => {
            console.log('onPress');
            Keyboard.dismiss()
            if(checkFormValidations()){
              setIsLoading(true)
              const params = {First_Name:fName,Last_Name:lName, Email_Id:email,Mobile_No:mobile,Password:pass,Device_Token:'TESTDEVICETOKEN654321', Device_OS:'iOS', Module_Type_Id:2}
              register(params,(regisRes) =>{
                setIsLoading(false)
                if(regisRes?.status == 1){
                  const data = regisRes && regisRes.data[0]
                  console.log('data',data)
                  navigation.navigate('SecurityCode', {pagetitle:'Security Code', pagesubs:'WE’VE SENT A CODE TO YOUR PHONE.PLEASE ENTER BELOW:', email:email})
                }else{
                  const msg = userRes?.message ?? 'Something went wront, Please try again later.'
                  Alert.alert('SukhTax',msg)
                }
              })
            }
          }}
        />
        <SKButton
          fontSize={16}
          marginTop={10}
          leftImage = {back_arrow}
          fontWeight={'normal'}
          width = '100%'
          backgroundColor={Colors.CLR_F58080}
          borderColor={Colors.CLR_EB0000}
          title={'Go Back to Log In'}
          onPress={() => {
            console.log('onPress');
            navigation.navigate('Login')
          }}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};



export default SignUp;
