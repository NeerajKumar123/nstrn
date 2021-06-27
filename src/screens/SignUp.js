import React, {useState} from 'react';
import {TouchableOpacity, View, Alert, ScrollView, Image} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues'
import * as Colors from '../constants/ColorDefs';
const back_arrow = require('../../assets/back_arrow.png');
const user = require('../../assets/user.png');
const header_logo = require('../../assets/header_logo.png');

const SignUp = props => {
  const navigation = useNavigation()
  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [pass, setPass] = useState('')
  const [cPass, setCPass] = useState('')

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
      }}>
      <Header />
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
          leftAccImage={user}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'First Name'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setFName(value)
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          maxLength = {15}
          rightAccImage={user}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Last Name'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setLName(value)
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          rightAccImage={user}
          maxLength = {30}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Email Address'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setEmail(value)
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          maxLength = {10}
          rightAccImage={user}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Phone Number'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setMobile(value)
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          rightAccImage={user}
          maxLength = {6}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Password'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setPass(value)
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          rightAccImage={user}
          maxLength = {6}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
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
            if(checkFormValidations()){
              console.log('All Okay', fName, lName, mobile, email, pass, cPass)
              navigation.goBack()
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
            navigation.goBack()
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

export default SignUp;
