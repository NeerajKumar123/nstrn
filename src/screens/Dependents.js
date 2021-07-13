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
} from 'react-native';
import SKDropdown from '../components/SKDropdown';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {register} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const Dependents = props => {
  const navigation = useNavigation();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [sinNo, setSinNo] = useState('');
  const [relation, setRelation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={fName}
          placeholder="Enter First Name"
          onEndEditing={value => {}}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Enter Last Name"
          onEndEditing={value => {}}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={dob}
          placeholder="Enter Date"
          onEndEditing={value => {}}
        />
        <SKDropdown
          marginBottom={2}
          maxLength={15}
          borderColor={Colors.CLR_0065FF}
          value={gender}
          placeholder="Select Gender"
          onEndEditing={value => {}}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={sinNo}
          placeholder="Enter SIN"
          onEndEditing={value => {}}
        />
        <SKDropdown
          marginBottom={2}
          maxLength={15}
          borderColor={Colors.CLR_0065FF}
          value={relation}
          placeholder="Select relation"
          onEndEditing={value => {}}
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
    </View>
  );
};

export default Dependents;
