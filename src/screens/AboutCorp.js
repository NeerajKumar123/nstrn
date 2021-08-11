import React, {useState, useEffect} from 'react';
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
import {incorpGetNatureOfBussiness, incorpSaveAboutCorp} from '../apihelper/Api'
import * as CustomFonts from '../constants/FontsDefs'
import TouchableInput from '../components/TouchableInput';
import SKModel from '../components/SKModel';

const AboutCorp = props => {
  const navigation = useNavigation()
  const [naturesOfBussiness, setNaturesOfBussiness] = useState()
  const [selectedNature, setSelectedNature] = useState()
  const [ifOther, setIfOther] = useState()
  const [bussAddress, setBussAddress] = useState()
  const [isNOBVisible, setIsNOBVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    let isValidForm = true;
    const isNatureValid =  true
    const isOtherValid =  true
    const isBAddressValid =  true
    if (!isNatureValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please select a valid nature of bussiness.');
    }else if(!isOtherValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter if any other.');
    }else if(!isBAddressValid){
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid bussiness address.');
    }
    return isValidForm;
  };

  useEffect(() => {
    setIsLoading(true)
    incorpGetNatureOfBussiness({}, (natureRes) =>{
      if(natureRes?.status == 1){
        const natures = natureRes?.data
        setNaturesOfBussiness(natures)
        setSelectedNature(natures[0])
        setIsLoading(false)
      }
    })
  }, [])

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
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <Heading value="ABOUT YOUR CORPORATION" marginTop={26} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="LET'S LEARN MORE ABOUT
          YOUR BUSINESS"
        />
        <TouchableInput
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select"
          value={selectedNature?.nature_of_business}
          onClicked={() => {
            setIsNOBVisible(true);
          }}
        />
        <SKInput
          marginBottom={2}
          maxLength = {15}
          borderColor={Colors.CLR_0065FF}
          value={ifOther}
          placeholder = 'IF OTHER, PLEASE SPECIFY'
          onEndEditing={value => {
            setIfOther(value)
          }}
        />
        <SKInput
          marginBottom={2}
          maxLength = {15}
          height = {100}
          borderColor={Colors.CLR_0065FF}
          value={bussAddress}
          placeholder = 'BUSINESS ADDRESS (IF SAME AS INCORPORATOR, PLEASE ENTER SAME ADDRESS)'
          onEndEditing={value => {
            setBussAddress(value)
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
            Keyboard.dismiss()
            if(checkFormValidations()){
              setIsLoading(true)
              const {incorporation_id, user_id} = global.statusData
              const params = {User_id:user_id, Incorporation_Id:incorporation_id,Nature_of_Business_Id:selectedNature.nature_of_business_id, Other_Business:ifOther,Business_Address:bussAddress}
              incorpSaveAboutCorp(params,(saveRes) =>{
                console.log('saveRes',saveRes)
                setIsLoading(false)
                if(saveRes?.status == 1){
                  const data = saveRes && saveRes.data[0]
                  navigation.navigate('IncorpFinalStep');
                }else{
                  const msg = userRes?.message ?? 'Something went wront, Please try again later.'
                  Alert.alert('SukhTax',msg)
                }
              })
            }
          }}
        />
      </ScrollView>
      {isNOBVisible && (
        <SKModel
          title="Select Gender"
          data={naturesOfBussiness}
          keyLabel="nature_of_business"
          onClose={() => {
            setIsNOBVisible(false);
          }}
          onSelect={value => {
            setIsNOBVisible(false)
            setSelectedNature(value)
            console.log('value',value)
          }}
        />
      )}
      </KeyboardAvoidingView>
    </View>
  );
};



export default AboutCorp;
