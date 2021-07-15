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
import {register} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');
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
    const isDOBValid = Validator.isValidField(dob, ST_REGEX.FName);
    const isGenderValid = Validator.isValidField(gender, ST_REGEX.FName);
    const isSinValid = Validator.isValidField(sinNo, ST_REGEX.FName);
    const isRelationValid = Validator.isValidField(relation, ST_REGEX.FName);

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Mailing address');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid province');
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
      {isLoading && <SKLoader />}
      <AppHeader navigation = {navigation}/>
      <ScrollView
        style={{
          width: '100%',
          paddingHorizontal: 20
        }}>
        <Heading value="WHO IS IN YOUR FAMILY" marginTop={26} />
        <Heading
          fontSize={20}
          marginTop={45}
          color={Colors.CLR_D9272A}
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
          onEndEditing={value => {}}
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Enter Last Name"
          onEndEditing={value => {}}
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
          rightAccImage = {CustomFonts.ArrowDown}
          value = {gender}
          placeholder = 'Select Gender'
          onClicked={() => {
            console.log('sdsd');
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
          onEndEditing={value => {}}
        />
         <TouchableInput
         leftAccImage={CustomFonts.Handshake}
          rightAccImage = {CustomFonts.ArrowDown}
          value = {relation}
          placeholder="Select relation"
          onClicked={() => {
            console.log('sdsd');
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
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'MY TAX YEAR'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('MyTaxYear');
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
              console.log('====>',format(selectedDate, 'dd/MM/yyyy'))
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
