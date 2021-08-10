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

const IncorpDetailsPerc = props => {
  const navigation = useNavigation()
  const [address, setAddress] = useState()
  const [ownershipPerc, setOwnershipPerc] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    let isValidForm = true;
    const isAddValid =  Validator.isValidField(fName, ST_REGEX.FName)
    const isPercValid =  ownershipPerc > 0
    if (!isAddValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid Address');
    }else if(!isPercValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid Adsress');
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
          paddingHorizontal: 32,
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
          value={address}
          placeholder = 'Address'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setAddress(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Number}
          marginBottom={2}
          maxLength = {10}
          borderColor={Colors.CLR_0065FF}
          value={ownershipPerc}
          placeholder = 'PERCENTAGE OWNERSHIP(%)'
          onEndEditing={value => {
            setOwnershipPerc(value)
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
            navigation.navigate('AboutCorp') 
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



export default IncorpDetailsPerc;
