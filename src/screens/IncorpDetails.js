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
import * as CustomFonts from '../constants/FontsDefs'

const IncorpDetails = props => {
  const navigation = useNavigation()
  const [fName, setFName] = useState()
  const [mName, setMName] = useState()
  const [lName, setLName] = useState()
  const [email, setEmail] = useState()
  const [mobile, setMobile] = useState()
  const [altMobile, setAltMobile] = useState()
  const [sin, setSin] = useState()
  const [pass, setPass] = useState()
  const [cPass, setCPass] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid =  Validator.isValidField(fName, ST_REGEX.FName)
    const isMNameValid =  Validator.isValidField(mName, ST_REGEX.LName)
    const isLNameValid =  Validator.isValidField(lName, ST_REGEX.LName)
    const isEmailValid =  Validator.isValidField(email, ST_REGEX.Email)
    const isMobileValid =  Validator.isValidField(mobile, ST_REGEX.Mobile)
    const isPassValid =  Validator.isValidField(pass, ST_REGEX.Password)
    const isCPassValid =  Validator.isValidField(cPass, ST_REGEX.Password)

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid First Name');
    }else if(!isMNameValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid Middle Name');
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
        keyboardVerticalOffset={-150}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <Heading value="ABOUT YOU" marginTop={26} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="INCORPORATORS' DETAILS :"
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={26}
          marginBottom={2}
          maxLength = {15}
          borderColor={Colors.CLR_0065FF}
          value={fName}
          placeholder = 'First Name'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setFName(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginBottom={2}
          maxLength = {15}
          borderColor={Colors.CLR_0065FF}
          value={mName}
          placeholder = 'Middle Name'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setMName(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginBottom={2}
          maxLength = {15}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder = 'Last Name'
          onEndEditing={value => {
            setLName(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Email}
          marginBottom={2}
          maxLength = {30}
          borderColor={Colors.CLR_0065FF}
          value={email}
          placeholder = 'Email Address'
          onEndEditing={value => {
            setEmail(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Phone}
          marginBottom={2}
          maxLength = {10}
          borderColor={Colors.CLR_0065FF}
          value={mobile}
          placeholder = 'Phone Number'
          onEndEditing={value => {
            setMobile(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Phone}
          marginBottom={2}
          maxLength = {10}
          borderColor={Colors.CLR_0065FF}
          value={altMobile}
          placeholder = 'Alternate Phone Number'
          onEndEditing={value => {
            setAltMobile(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Number}
          marginBottom={2}
          maxLength = {10}
          borderColor={Colors.CLR_0065FF}
          value={sin}
          placeholder = 'SIN Number'
          onEndEditing={value => {
            setSin(value)
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
            navigation.navigate('IncorpDetailsPerc') 
            return
            Keyboard.dismiss()
            if(checkFormValidations()){
              setIsLoading(true)
              const testDeviceToken = 'DEVICE_TOKEN_123456789'
              const params = {First_Name:fName,Last_Name:lName, Email_Id:email,Mobile_No:mobile,Password:pass,Device_Token:testDeviceToken, Device_OS:'iOS', Module_Type_Id:2}
              register(params,(regisRes) =>{
                setIsLoading(false)
                if(regisRes?.status == 1){
                  const data = regisRes && regisRes.data[0]
                  console.log('data',data)
                  navigation.navigate('AboutCorp', {pagetitle:'Security Code', pagesubs:'WE’VE SENT A CODE TO YOUR PHONE.PLEASE ENTER BELOW:', email:email})
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



export default IncorpDetails;
