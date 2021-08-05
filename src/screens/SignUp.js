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
import * as CustomFonts from '../constants/FontsDefs'
import {register} from '../apihelper/Api'

const SignUp = props => {
  const navigation = useNavigation()
  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [pass, setPass] = useState('')
  const [cPass, setCPass] = useState('')
  const [isSecurePass, setIsSecurePass] = useState(true)
  const [isSecurePassC, setIsSecurePassC] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid =  Validator.isValidField(fName, ST_REGEX.FName)
    const isLNameValid =  Validator.isValidField(lName, ST_REGEX.LName)
    const isEmailValid =  Validator.isValidField(email, ST_REGEX.Email)
    const isMobileValid =  Validator.isValidField(mobile, ST_REGEX.Mobile)
    // const isPassValid =  Validator.isValidField(pass, ST_REGEX.Password)
    // const isCPassValid =  Validator.isValidField(cPass, ST_REGEX.Password)
    const isPassValid =  pass && pass.length > 4 && pass.length < 17
    const isCPassValid =  cPass && cPass.length > 4 && cPass.length < 17


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
        width: '100%',
        height: '100%',
      }}>
      {isLoading && <SKLoader/>}
      <AppHeader navigation = {navigation}/>
      <KeyboardAvoidingView
        behavior={'position'}
        enabled={true}
        style={{flex: 1, width:'100%', paddingHorizontal:20, paddingBottom:10}}
        keyboardVerticalOffset={-200}>
      <ScrollView
      showsVerticalScrollIndicator = {false}
        style={{
          width: '100%',
          marginBottom: Platform.OS == 'ios' ?  30 : 0,
        }}>
        <Heading value="LETS LOG IN" marginTop={26} />
        <Heading
          fontSize={16}
          marginTop={45}
          color={Colors.BLACK}
          value="LETS GET TO KNOW YOU BETTER"
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={26}
          marginBottom={2}
          autoCapitalize = 'words'
          maxLength = {15}
          borderColor={Colors.CLR_0065FF}
          value={''}
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
          value={lName}
          placeholder = 'Last Name'
          autoCapitalize = 'words'
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
          leftAccImage={CustomFonts.Lock}
          marginBottom={2}
          maxLength = {16}
          borderColor={Colors.CLR_0065FF}
          value={pass}
          isSecurePass = {isSecurePass}
          placeholder = 'Password'
          rightAccImage={isSecurePass ? CustomFonts.EyeOutlineOff : CustomFonts.EyeOutlineOn}
          onRightPressed = {()=>{
            setIsSecurePass(!isSecurePass)
          }}
          onEndEditing={value => {
            setPass(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Lock}
          marginBottom={2}
          rightAccImage={isSecurePassC ? CustomFonts.EyeOutlineOff : CustomFonts.EyeOutlineOn}
          maxLength = {16}
          borderColor={Colors.CLR_0065FF}
          value={''}
          isSecurePass = {isSecurePassC}
          placeholder = 'Confirm Password'
          onRightPressed = {()=>{
            setIsSecurePassC(!isSecurePassC)
          }}
          onEndEditing={value => {
            setCPass(value)
          }}
        />
      </ScrollView>
      <View style = {{paddingHorizontal:20}}>
      <SKButton
          fontSize={16}
          width = '100%'
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Continue'}
          onPress={() => {
            Keyboard.dismiss()
            if(checkFormValidations()){
              setIsLoading(true)
              const testDeviceToken = 'DEVICE_TOKEN_123456789'
              const params = {First_Name:fName,Last_Name:lName, Email_Id:email,Mobile_No:mobile,Password:pass,Device_Token:testDeviceToken, Device_OS:'iOS', Module_Type_Id:2}
              register(params,(regisRes) =>{
                setIsLoading(false)
                if(regisRes?.status == 1){
                  const data = regisRes?.data
                  global.userInfo = {...global.userInfo,user_id:data}
                  navigation.navigate('SecurityCode', {pagetitle:'Security Code', pagesubs:'WE’VE SENT A CODE TO YOUR PHONE.PLEASE ENTER BELOW:', email:email})
                }else{
                  const msg = regisRes?.message ?? 'Something went wront, Please try again later.'
                  Alert.alert('SukhTax',msg)
                }
              })
            }
          }}
        />
      </View>
      </KeyboardAvoidingView>
      
    </View>
  );
};



export default SignUp;
