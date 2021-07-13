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

const BankingAndMore = props => {
  const navigation = useNavigation();
  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [branchNo, setBranhcNo] = useState('')
  const [residency, setResidency] = useState('')
  const [enrtyDate, setEntryDate] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isBankValid = Validator.isValidField(bank,ST_REGEX.FName);
    const isAccValid = Validator.isValidField(accountNo,ST_REGEX.FName);
    const isBranchValid = Validator.isValidField(branchNo,ST_REGEX.FName);
    const isResidencyValid = Validator.isValidField(residency,ST_REGEX.FName);
    const isEnrtyDateValid = Validator.isValidField(enrtyDate,ST_REGEX.FName);

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
          marginBottom:100
        }}>
          <Heading value="BANKING AND MORE" marginTop={26} />
          <Heading
            fontSize={20}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="PLEASE ENTER YOUR DIRECT DIPOSIT INFORMATION"
          />
           <SKDropdown
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={bank}
            placeholder="Select Bank"
            onEndEditing={value => {
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
          <SKDropdown
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={residency}
            placeholder="Select Residency"
            onEndEditing={value => {
            }}
          />
           <Heading
            fontSize={20}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="DATE OF ENTRY INTO CANADA(IF IMMIGRATED)"
          />
          <SKInput
            marginTop={20}
            marginBottom={0}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={enrtyDate}
            placeholder="#Enter date"
            onEndEditing={value => {
            }}
          />
           <SKButton
           marginTop= {30}
          fontSize={16}
          rightImage={right_arrow}
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
    </View>
  );
};

export default BankingAndMore;
