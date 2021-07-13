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
const left_arrow = require('../../assets/left_arrow.png');
const usericon = require('../../assets/username.png');
const  emailicon = require('../../assets/email.png');
const phoneicon = require('../../assets/phone.png');
const passicon = require('../../assets/pass.png');
const hideicon = require('../../assets/hide.png');

const AboutCorp = props => {
  const navigation = useNavigation()
  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')

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
      Alert.alert('SukhTax','Please enter valid First Name');
    }else if(!isLNameValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid Last Name');
    }else if(!isEmailValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid Email Address');
    }else if(!isMobileValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid Phone Number');
    }else if(!isPassValid){
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
        flex:1
      }}>
      {isLoading && <SKLoader/>}
      <AppHeader navigation = {navigation}/>
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
        <Heading value="ABOUT YOUR CORPORATION" marginTop={26} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="LET'S LEARN MORE ABOUT
          YOUR BUSINESS"
        />
        <SKInput
          marginTop={26}
          marginBottom={2}
          maxLength = {15}
          leftAccImage={usericon}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'NATURE OF BUSINESS'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setFName(value)
          }}
        />
        <SKInput
          marginBottom={2}
          maxLength = {15}
          leftAccImage={usericon}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'IF OTHER, PLEASE SPECIFY'
          onEndEditing={value => {
            setFName(value)
          }}
        />
        <SKInput
          marginBottom={2}
          maxLength = {15}
          leftAccImage={usericon}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'BUSINESS ADDRESS (IF SAME AS INCORPORATOR, PLEASE ENTER SAME ADDRESS)'
          onEndEditing={value => {
            setFName(value)
          }}
        />
         <SKButton
          fontSize={16}
          marginTop={33}
          width = '100%'
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'NEXT'}
          onPress={() => {
            navigation.navigate('IncorpFinalStep')
            return
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
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};



export default AboutCorp;
