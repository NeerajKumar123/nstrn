import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {getUserProfileDetails, updateUserProfile} from '../apihelper/Api';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');
const usericon = require('../../assets/username.png');
const  emailicon = require('../../assets/email.png');
const phoneicon = require('../../assets/phone.png');

const Profile = props => {
  const navigation = useNavigation();
  const [fName, setFName] = useState();
  const [lName, setLName] = useState();
  const [email, setEmail] = useState();
  const [mobile, setMobile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.LName);
    const isEmailValid = Validator.isValidField(email, ST_REGEX.Email);
    const isMobileValid = Validator.isValidField(mobile, ST_REGEX.Mobile);

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid First Name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Last Name');
    } else if (!isEmailValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Email Address');
    } else if (!isMobileValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Phone Number');
    }
    return isValidForm;
  };
  useEffect(() => {
    const userid = global.userInfo?.user_id
    setIsLoading(true)
    getUserProfileDetails({user_id:userid},(userDetailsRes)=>{
      setIsLoading(false)
      if(userDetailsRes?.status == 1){
        const user = userDetailsRes?.data?.[0]
        console.log('userDetailsRes',user)
        setFName(user?.firstname ?? '')
        setLName(user?.lastname ?? '')
        setEmail(user?.email ?? '')
        setMobile(user?.mobile ?? '')
      }else{
        const msg = userDetailsRes?.message ?? 'Something went wront, Please try again later.'
        Alert.alert('SukhTax',msg)
      }
    })
  }, [])
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      {isLoading && <SKLoader />}
      <AppHeader navigation = {navigation}/>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          flex: 1,
        }}>
        <Heading value="PROFILE" marginTop={26} />
        <SKInput
          marginTop={26}
          marginBottom={0}
          maxLength={15}
          leftAccImage={usericon}
          borderColor={Colors.CLR_0065FF}
          value={fName}
          placeholder="First Name"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setFName(value);
          }}
        />
        <SKInput
          leftAccImage={usericon}
          marginBottom={0}
          maxLength={15}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Last Name"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setLName(value);
          }}
        />
        <SKInput
          leftAccImage={emailicon}
          marginBottom={0}
          maxLength={30}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={email}
          placeholder="Email Address"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setEmail(value);
          }}
        />
        <SKInput
          leftAccImage={phoneicon}
          marginBottom={0}
          maxLength={10}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={mobile}
          placeholder="Phone Number"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setMobile(value);
          }}
        />
        <SKButton
          fontSize={16}
          marginTop={33}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            console.log('onPress');
            Keyboard.dismiss();
            if (checkFormValidations()) {
              setIsLoading(true);
              const params = {
                user_id:2,
                First_Name: fName,
                Last_Name: lName,
                Email_Id: email,
                Mobile_No: mobile
              };
              updateUserProfile(params, updateRes => {
                console.log('updateRes', updateRes);
                setIsLoading(false);
              });
            }
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 18,
            justifyContent: 'center',
          }}>
          <SKButton
            fontSize={16}
            rightImage={right_arrow}
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'CHANGE PASSWORD'}
            onPress={() => {
                console.log('link pressed');
                navigation.navigate('ForgotPassword', {pagetitle:'CHANGE PASSWORD?', pagesubs:'WE HAVE SENT A SECURITY CODE TO YOUR PHONE. PLEASE ENTER BELOW:', preScreen:'Profile'})
                }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
