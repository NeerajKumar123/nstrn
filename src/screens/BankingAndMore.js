import React, { useState } from 'react';
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
import SKModel from '../components/SKModel';
import SKInput from '../components/SKInput';
import { useNavigation } from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import { ST_REGEX } from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import { register } from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format } from 'date-fns'
const {width} = Dimensions.get('window');
const BankingAndMore = props => {
  const navigation = useNavigation();
  const [bank, setBank] = useState('');
  const [banks, setBanks] = useState([{ name: 'Bank 1' }, { name: 'Bank 2' }, { name: 'Bank 3' }, { name: 'Bank 4' }, { name: 'Bank 5' }, { name: 'Bank 6' }])
  const [accountNo, setAccountNo] = useState('');
  const [branchNo, setBranhcNo] = useState('')
  const [residency, setResidency] = useState('')
  const [residencies, setResidencies] = useState([{ name: 'Residency 1' }, { name: 'Residency 2' }, { name: 'Residency 3' }, { name: 'Residency 4' }, { name: 'Residency 5' }, { name: 'Residency 6' }])
  const [enrtyDate, setEntryDate] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isBankVisible, setIsBankVisible] = useState(false)
  const [isResidenceVisible, setIsResidenceVisible] = useState(false)
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)


  const checkFormValidations = () => {
    let isValidForm = true;
    const isBankValid = Validator.isValidField(bank, ST_REGEX.FName);
    const isAccValid = Validator.isValidField(accountNo, ST_REGEX.FName);
    const isBranchValid = Validator.isValidField(branchNo, ST_REGEX.FName);
    const isResidencyValid = Validator.isValidField(residency, ST_REGEX.FName);
    const isEnrtyDateValid = Validator.isValidField(enrtyDate, ST_REGEX.FName);

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
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{
          width: '100%',
          paddingHorizontal: 20,
          marginBottom: 100
        }}>
        <Heading value="BANKING AND MORE" marginTop={26} />
        <Heading
          fontSize={20}
          marginTop={45}
          color={Colors.CLR_D9272A}
          value="PLEASE ENTER YOUR DIRECT DIPOSIT INFORMATION"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Bank}
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Bank"
          value = {bank?.name}
          onClicked={() => {
            setIsBankVisible(true);
          }}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={accountNo}
          placeholder="#Enter Account Number"
          onEndEditing={value => {
          }}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={branchNo}
          placeholder="#Enter Branch Number"
          onEndEditing={value => {
          }}
        />
        <Heading
          fontSize={20}
          marginTop={45}
          value="WHAT IS YOUR RESIDENCY:"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Home}
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Residency"
          value = {residency?.name}
          onClicked={() => {
            console.log('sdsd');
            setIsResidenceVisible(true);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={45}
          color={Colors.CLR_D9272A}
          value="DATE OF ENTRY INTO CANADA(IF IMMIGRATED)"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Calender}
          value = {enrtyDate && format(enrtyDate, 'dd/MM/yyyy')}
          placeholder="Date of Birth (DD/MM/YYYY)"
          onClicked={() => {
            setIsDatePickerVisible(true);
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'FAMILY'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('FamilyDetails');
          }}
        />
      </ScrollView>
      {isBankVisible && (
        <SKModel
          title="Select"
          data={banks}
          keyLabel='name'
          onClose={() => {
            setIsBankVisible(false);
          }}
          onSelect={value => {
            console.log('setIsBankVisible', value);
            setBank(value)
            setIsBankVisible(false);
          }}
        />
      )}
      {isResidenceVisible && (
        <SKModel
          title="Select"
          data={residencies}
          keyLabel='name'
          onClose={() => {
            setIsResidenceVisible(false);
          }}
          onSelect={value => {
            console.log('setIsBankVisible', value);
            setResidency(value)
            setIsResidenceVisible(false);
          }}
        />
      )}
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
              setEntryDate(selectedDate)
              console.log('====>',format(selectedDate, 'dd/MM/yyyy'))
              setIsDatePickerVisible(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default BankingAndMore;
