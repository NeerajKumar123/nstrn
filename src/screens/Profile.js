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
import * as CustomFonts from '../constants/FontsDefs'
import {getUserProfileDetails, updateUserProfile} from '../apihelper/Api';

const Profile = props => {
  const navigation = useNavigation();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName,ST_REGEX.FullName)
    const isLNameValid = Validator.isValidField(lName,ST_REGEX.FullName)
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
    const {user_id} = global.userInfo
    setIsLoading(true)
    getUserProfileDetails({user_id:user_id},(userDetailsRes)=>{
      setIsLoading(false)
      if(userDetailsRes?.status == 1){
        const user = userDetailsRes?.data?.[0]
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
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <Heading value="PROFILE" marginTop={26} />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={26}
          marginBottom={0}
          maxLength={15}
          borderColor={Colors.CLR_0065FF}
          value={fName}
          placeholder="First Name"
          onEndEditing={value => {
            setFName(value);
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginBottom={0}
          maxLength={15}
          onRightPressed={() => {
          }}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Last Name"
          onEndEditing={value => {
            setLName(value);
          }}
        />
        <SKInput
          editable = {false}
          leftAccImage={CustomFonts.Email}
          marginBottom={0}
          maxLength={30}
          autoCapitalize = 'none'
          onRightPressed={() => {
          }}
          borderColor={Colors.CLR_0065FF}
          value={email}
          placeholder="Email Address"
          onEndEditing={value => {
            setEmail(value);
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Phone}
          marginBottom={0}
          maxLength={10}
          onRightPressed={() => {
          }}
          borderColor={Colors.CLR_0065FF}
          value={mobile}
          keyboardType = 'number-pad'
          placeholder="Phone Number"
          onEndEditing={value => {
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
            Keyboard.dismiss();
            if (checkFormValidations()) {
              setIsLoading(true);
              const {user_id} = global.userInfo
              const params = {
                user_id:user_id,
                First_Name: fName,
                Last_Name: lName,
                Email_Id: email,
                Mobile_No: mobile
              };
              updateUserProfile(params, updateRes => {
                console.log('updateRes',updateRes)
                setTimeout(() => {
                  setIsLoading(false)
                }, 1000);
                
                if (updateRes?.status == 1) {
                  navigation.goBack()
                  Alert.alert('Sukhtax',updateRes.message ? updateRes.message : '' )  
                }else{
                  Alert.alert('Sukhtax','Something went wrong.')  
                }
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
            rightImage={CustomFonts.ChevronRight}
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'CHANGE PASSWORD'}
            onPress={() => {
                navigation.navigate('ForgotPassword', {pagetitle:'CHANGE PASSWORD?', pagesubs:'WE HAVE SENT A SECURITY CODE TO YOUR PHONE. PLEASE ENTER BELOW:', preScreen:'Profile'})
                }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
