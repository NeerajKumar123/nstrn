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
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import {MARITAL_STATUS, YES_NO} from '../constants/StaticValues';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {register} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const FamilyDetails = props => {
  const navigation = useNavigation();
  const [maritalStatus, setMaritalStatus] = useState()
  const [mChangeOpton, setMChangeOpton] = useState()
  const [dependentOption, setDependentOption] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [isMVisible, setIsMVisible] = useState()
  const [isMChangeVisible, setIsMChangeVisible] = useState()
  const [isDepOptionVisible, setIsDepOptionVisible] = useState()

  const checkFormValidations = () => {
    let isValidForm = true;
    const isBankValid = Validator.isValidField(bank,ST_REGEX.FName);
    const isAccValid = Validator.isValidField(accountNo,ST_REGEX.FName);
    if (!isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Mailing address');
    } else if (!isAccValid) {
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
          paddingHorizontal: 20,
        }}>
          <Heading value="WHO IS IN YOUR FAMILY" marginTop={26} />
          <Heading
            fontSize={20}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="MARITAL STATUS ON DECEMBER 31, 2018"
          />
           <TouchableInput
          rightAccImage = {CustomFonts.ArrowDown}
          placeholder="Select Marital Status"
          value = {maritalStatus}
          onClicked={() => {
            console.log('sdsd');
            setIsMVisible(true);
          }}
        />
          <Heading
            fontSize={20}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="DID YOUR MARITAL STATUS CHANGED IN 2018?"
          />
          <TouchableInput
          rightAccImage = {CustomFonts.ArrowDown}
          placeholder="Select"
          value = {mChangeOpton}
          onClicked={() => {
            console.log('sdsd');
            setIsMChangeVisible(true);
          }}
        />
           <Heading
            fontSize={20}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="ANY DEPENDENTS IN 2018?"
          />
           <TouchableInput
          rightAccImage = {CustomFonts.ArrowDown}
          placeholder="Select"
          value = {dependentOption}
          onClicked={() => {
            console.log('sdsd');
            setIsDepOptionVisible(true);
          }}
        />
          <SKButton
          marginTop ={30}
          fontSize={16}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'DEPENDENTS'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('Dependents');
          }}
        />
        {isMVisible && (
          <SKModel
            title="Select Gender"
            data={MARITAL_STATUS}
            onClose={() => {
              setIsMVisible(false);
            }}
            onSelect={value => {
              console.log('value', value);
              setMaritalStatus(value)
              setIsMVisible(false);
            }}
          />
        )}
        {isMChangeVisible && (
          <SKModel
            title="Select"
            data={YES_NO}
            onClose={() => {
              setIsMChangeVisible(false);
            }}
            onSelect={value => {
              console.log('value', value);
              setMChangeOpton(value)
              setIsMChangeVisible(false);
            }}
          />
        )}
        {isDepOptionVisible && (
          <SKModel
            title="Select Gender"
            data={YES_NO}
            onClose={() => {
              setIsDepOptionVisible(false);
            }}
            onSelect={value => {
              console.log('value', value);
              setDependentOption(value)
              setIsDepOptionVisible(false);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default FamilyDetails;
