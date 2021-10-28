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
import SKDatePicker from '../components/SKDatePicker';
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
  const pageParams = props.route.params;
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
  const depCount = pageParams?.depCount
  let dependents = pageParams?.alreadyAddedDependents ? pageParams?.alreadyAddedDependents : []

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.LName);
    const isDOBValid = dob
    const isGenderValid = gender
    const isSinValid = Validator.isValidSIN(sinNo)
    const isRelationValid = relation
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
    const {user_id,tax_file_id} = global.onlineStatusData
    const params = {
      User_id:user_id,
      Tax_File_Id:tax_file_id,
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
          value={`DEPENDENT ${depCount}`}
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
        <SKInput
          leftAccImage={CustomFonts.Number}
          marginTop={20}
          marginBottom={10}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={sinNo}
          placeholder="Enter SIN"
          keyboardType = 'number-pad'
          onEndEditing={value => {
            setSinNo(value)
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
         <TouchableInput
         leftAccImage={CustomFonts.Handshake}
          rightAccImage = {CustomFonts.ChevronDown}
          value = {relation}
          placeholder="Select relation"
          onClicked={() => {
            setIsRelationVisible(true);
          }}
        />
        {dependents && dependents.length > 0 ?
        <>
      <SKButton
      marginTop ={30}
      fontSize={16}
      borderWidth = {1}
      leftImage = {CustomFonts.black_plus}
      fontWeight={'normal'}
      titleColor = {Colors.PRIMARY_BORDER}
      backgroundColor={Colors.WHITE}
      borderColor={Colors.PRIMARY_BORDER}
      title={'ADD ANOTHER DEPENDENT'}
        onPress={() => {
          if(depCount < 5){
            if(checkFormValidations()){
              const params = prepareParams()
              dependents.push(params)
              navigation.push('Dependents', {depCount:depCount+1,alreadyAddedDependents:dependents});
            }
          }else{
            Alert.alert('SukhTax', 'You are not allowed to add more than 4 dependents.')
          }
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
          if(dependents && dependents.length > 0){
            setIsLoading(true)
            dependents.forEach(params =>{
              onlineSaveDependentInfo(params, (depRes) =>{
                setIsLoading(false)
                navigation.navigate('MyTaxYear',{pageIndex:0});
              })  
            })
          }else{
            Alert.alert('Sukhtax','Please add at least dependent.')
          }
        }}
      />
      </>
      :
      <>
      <SKButton
      marginTop ={30}
      fontSize={16}
      borderWidth = {1}
      leftImage = {CustomFonts.black_plus}
      fontWeight={'normal'}
      titleColor = {Colors.PRIMARY_BORDER}
      backgroundColor={Colors.WHITE}
      borderColor={Colors.PRIMARY_BORDER}
      title={'ADD DEPENDENT'}
      onPress={() => {
        if(checkFormValidations()){
          const params = prepareParams()
          dependents.push(params)
          navigation.push('Dependents', {depCount:depCount+1,alreadyAddedDependents:dependents});
        }
      }}
    />
    <SKButton
        marginTop ={15}
        fontSize={16}
        rightImage={CustomFonts.right_arrow}
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.PRIMARY_BORDER}
        title={'MY TAX YEAR'}
        onPress={() => {
          if(checkFormValidations()){
            const params = prepareParams()
            setIsLoading(true)
            onlineSaveDependentInfo(params, (depRes) =>{
              setIsLoading(false)
              navigation.navigate('MyTaxYear',{pageIndex:0});
            })  
          }
        }}
      />
      </>
      }
      </ScrollView>
      {isDatePickerVisible && (
        <SKDatePicker
        originalDate = {new Date()}
        maximumDate = {new Date()}
        title = {'Select date'}
        onCancelPressed = {(date)=>{
          setIsDatePickerVisible(false)
          setDOB(date);
        }}
        onDonePressed = {(date)=>{
          setDOB(date);
          setIsDatePickerVisible(false)
        }}
        />
      )}
      {isGenderVisible && (
          <SKModel
            title="Select"
            data={GENDER_OPTIONS}
            onClose={() => {
              setIsGenderVisible(false);
            }}
            onSelect={value => {
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
              setRelation(value)
              setIsRelationVisible(false);
            }}
          />
        )}
    </View>
  );
};

export default Dependents;
