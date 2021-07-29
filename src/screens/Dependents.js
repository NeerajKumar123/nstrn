import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import AppHeader from '../components/AppHeader';
import {GENDER_OPTIONS,RELATIONS} from '../constants/StaticValues';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {onlineSaveDependentInfo,onlineUpdateDependentInfo} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const {width} = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import {format } from 'date-fns'

const Dependents = props => {
  const navigation = useNavigation();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [sinNo, setSinNo] = useState('');
  const [relation, setRelation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState()
  const [isDatePickerVisible, setIsDatePickerVisible] = useState()
  const [isRelationVisible, setIsRelationVisible] = useState()

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.LName);
    const isDOBValid = dob
    const isGenderValid = gender
    const isSinValid = sinNo.length > 5
    const isRelationValid = relation
    console.log('fName',isFNameValid,isLNameValid,fName,lName)
    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid First Name.');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter Last Name.');
    }else if (!isDOBValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter DOB.');
    }else if (!isGenderValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select gender.');
    }else if (!isSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter SIN');
    }else if (!isRelationValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select gender');
    }
    return isValidForm;
  };

  const prepareParams = (depID) =>{
    const userid = global.userInfo?.user_id;
    const taxFileID = global.userInfo?.Tax_File_Id;
    const params = {
      User_id:userid,
      Tax_File_Id:taxFileID || 83,
      First_Name:fName,
      Last_Name:lName,
      DOB:dob && format(dob, 'yyyy-MM-dd'),
      Gender:gender,
      SIN_Number:sinNo,
      Relationship:relation
    }
    params.Tax_File_Dependent_Id = depID
    return params
  }

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        paddingBottom:Platform.OS == 'ios' ? 30 : 0
      }}>
      {isLoading && <SKLoader />}
      <AppHeader navigation = {navigation}/>
      <ScrollView
        style={{
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading 
        value="THIS IS SOMEONE WHO RELIES ON YOU FOR FINANCIAL SUPPORT"
        marginTop={20}
        fontSize={20}
        color={Colors.APP_RED_SUBHEADING_COLOR}
        />
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="DEPENDENT 1"
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={fName}
          placeholder="Enter First Name"
          onEndEditing={value => {
            setFName(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Enter Last Name"
          onEndEditing={value => {
            setLName(value)
          }}
        />
         <TouchableInput
          leftAccImage={CustomFonts.Calender}
          value = {dob && format(dob, 'dd/MM/yyyy')}
          placeholder="Date of Birth (DD/MM/YYYY)"
          onClicked={() => {
            setIsDatePickerVisible(true);
          }}
        />
         <TouchableInput
          leftAccImage={CustomFonts.Gender}
          rightAccImage = {CustomFonts.ChevronDown}
          value = {gender}
          placeholder = 'Select Gender'
          onClicked={() => {
            setIsGenderVisible(true);
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Number}
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={sinNo}
          placeholder="Enter SIN"
          onEndEditing={value => {
            setSinNo(value)
          }}
        />
         <TouchableInput
         leftAccImage={CustomFonts.Handshake}
          rightAccImage = {CustomFonts.ChevronDown}
          value = {relation}
          placeholder="Select relation"
          onClicked={() => {
            setIsRelationVisible(true);
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={15}
          height = {40}
          fontWeight = "bold"
          iconName="plus-circle-outline"
          iconsize={20}
          iconcolor={Colors.WHITE}
          width="100%"
          backgroundColor={Colors.SECONDARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'ADD ANOTHER DEPENDENT'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('BasicInfo');
          }}
        />
         <SKButton
          marginTop ={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'MY TAX YEAR'}
          onPress={() => {
            console.log('link pressed');
            if(checkFormValidations()){
              // onlineUpdateDependentInfo(params, (updateRes)=>{
              //   console.log('updateRes', updateRes)
              // })
              setIsLoading(true)
              const params = prepareParams()
              onlineSaveDependentInfo(params, (depRes) =>{
                console.log('depRes', depRes)
                setIsLoading(false)
                navigation.navigate('MyTaxYear');
              })
            }
          }}
        />
      </ScrollView>
      {isDatePickerVisible && (
        <View
          style={{
            backgroundColor: Colors.LIGHTGRAY,
            position: 'absolute',
            bottom: 0,
            height: Platform.OS == 'ios' ? 400 : 0,
            width: width,
          }}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              console.log(event.type, Date.parse(selectedDate));
              setDOB(selectedDate)
              setIsDatePickerVisible(false);
            }}
          />
        </View>
      )}
      {isGenderVisible && (
          <SKModel
            title="Select"
            data={GENDER_OPTIONS}
            onClose={() => {
              setIsGenderVisible(false);
            }}
            onSelect={value => {
              console.log('value', value);
              setGender(value)
              setIsGenderVisible(false);
            }}
          />
        )}
        {isRelationVisible && (
          <SKModel
            title="Select"
            data={RELATIONS}
            onClose={() => {
              setIsRelationVisible(false);
            }}
            onSelect={value => {
              console.log('value', value);
              setRelation(value)
              setIsRelationVisible(false);
            }}
          />
        )}
    </View>
  );
};

export default Dependents;
