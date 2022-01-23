import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Button,
  Text,
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import TouchableInput from '../components/TouchableInput';
import SKModel from '../components/SKModel';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import {format} from 'date-fns';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {refRegister, getInstitutionList} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import {getCanadaProvinceList} from '../apihelper/Api';
import SignatureCapture from 'react-native-signature-capture';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RoyaltySignup = props => {
  const navigation = useNavigation();
  const [bank, setBank] = useState();
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState();
  const [branchNo, setBranhcNo] = useState();
  const [accountHolderName, setAccountHolderName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postal, setPostal] = useState('');
  const [addLine1, setAddLine1] = useState('');
  const [addLine2, setAddLine2] = useState('');
  const [provinces, setProvinces] = useState();
  
  const [isAuthChecked, setIsAuthChecked] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isBankVisible, setIsBankVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isProvinceVisible, setIsProvinceVisible] = useState(false);
  const [dob, setDOB] = useState();

  useEffect(() => {
    setIsLoading(true);
    getInstitutionList({}, instRes => {
      setBanks(instRes?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const params = {};
    getCanadaProvinceList(params, provinceRes => {
      setIsLoading(false);
      setProvinces(provinceRes?.data);
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isBankValid = bank?.institution_id > 0;
    const isAccValid = accountNo?.length;
    const isBranchValid = branchNo?.length == 5;
    
    const isAccountHolderNameValid = true
    const isdobValid = true
    const isCityValid = true
    const isProvinceValid = true
    const isPostalCodeValid = true
    const isAddLine1Valid = true
    const isAddLine2Valid = true

    if (!isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid Institution.');
    } else if (!isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account number.');
    } else if (!isBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid branch code.');
    }  else if (!isAccountHolderNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account holder name.');
    }  else if (!isdobValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid DOB.');
    }  else if (!isCityValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid city.');
    }  else if (!isProvinceValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid province.');
    }  else if (!isPostalCodeValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid postal code.');
    }  else if (!isAddLine1Valid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid address line 1.');
    } else if (!isAddLine2Valid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid address line 2.');
    } else if (!isAuthChecked) { 
      isValidForm = false;
      Alert.alert(
        'SukhTax',
        'Have you read terms and conditions if reviewed please accept',
      );
    }
    return isValidForm;
  };

  // const prepareParams = () => {
  //   const {user_id} = global.onlineStatusData
  //   const params = {
  //     User_Id: user_id,
  //     Institiution_Id:bank?.institution_id,
  //     Account_Number: accountNo,
  //     Branch_Number: branchNo
  //   };
  //   return params;
  // };

  const prepareParams = () => {
    const {user_id} = global.onlineStatusData;
    const params = {
      User_Id: user_id,
      Institiution_Id: bank?.institution_id,
      Account_Number: accountNo,
      Branch_Number: branchNo,
      DOB: '16-03-1988',
      Address_City: 'Patna',
      Address_State: 'Bihar',
      Address_PostalCode: '110011',
      Address_Line1: 'Address_Line1',
      Address_Line2: 'Address_Line2',
    };
    return params;
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        alignContent: 'center',
      }}>
      <AppHeader navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled={true}
        style={{flex: 1, width: '100%', paddingBottom: 10}}
        keyboardVerticalOffset={0}>
        {isLoading && <SKLoader />}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}>
          <Heading
            value="SUKH TAX LOYALTY PROGRAM"
            marginTop={12}
            fontWeight={'700'}
            fontSize={18}
            color={Colors.APP_RED_SUBHEADING_COLOR}
          />
          <Heading
            fontSize={19}
            marginTop={5}
            color={Colors.CLR_5F5F94}
            fontWeight={'400'}
            value="We just need your direct deposit information for payout, we have the rest of your information."
          />
          <TouchableInput
            leftAccImage={CustomFonts.Bank}
            rightAccImage={CustomFonts.ChevronDown}
            placeholder="Select Bank"
            value={bank?.institution_name}
            onClicked={() => {
              setIsBankVisible(true);
            }}
          />
          <SKInput
            marginTop={10}
            maxLength={30}
            leftAccImage={CustomFonts.Number}
            borderColor={Colors.CLR_0065FF}
            value={accountNo}
            keyboardType="number-pad"
            placeholder="Enter Account Number"
            onEndEditing={value => {
              setAccountNo(value);
            }}
          />
          <SKInput
            marginTop={10}
            marginBottom={0}
            leftAccImage={CustomFonts.Number}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={branchNo}
            keyboardType="number-pad"
            placeholder="Enter Branch Number"
            onEndEditing={value => {
              setBranhcNo(value);
            }}
          />
          <SKInput
            marginTop={10}
            marginBottom={0}
            leftAccImage={CustomFonts.Number}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={accountHolderName}
            placeholder="Enter account holder name"
            onEndEditing={value => {
              setAccountHolderName(value);
            }}
          />
          <TouchableInput
            leftAccImage={CustomFonts.Calender}
            value={dob && format(dob, 'dd/MM/yyyy')}
            placeholder="Date of Birth (DD/MM/YYYY)"
            onClicked={() => {
              setIsDatePickerVisible(true);
            }}
          />
          <SKInput
            marginTop={10}
            marginBottom={0}
            leftAccImage={CustomFonts.Number}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={accountHolderName}
            placeholder="Enter city"
            onEndEditing={value => {
              setAccountHolderName(value);
            }}
          />
          <TouchableInput
            rightAccImage={CustomFonts.ChevronDown}
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={province?.state_name}
            placeholder="Select Province"
            onClicked={() => {
              setIsProvinceVisible(true);
            }}
          />
          <SKInput
            marginTop={10}
            marginBottom={0}
            leftAccImage={CustomFonts.Number}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={postal}
            placeholder="Enter postal code"
            onEndEditing={value => {
              setPostal(value);
            }}
          />
          <SKInput
            marginTop={10}
            marginBottom={0}
            leftAccImage={CustomFonts.Number}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={addLine1}
            placeholder="Address line 1"
            onEndEditing={value => {
              setAddLine1(value);
            }}
          />
          <SKInput
            marginTop={10}
            marginBottom={0}
            leftAccImage={CustomFonts.Number}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={addLine2}
            placeholder="Address line 2"
            onEndEditing={value => {
              setAddLine2(value);
            }}
          />
          <SKCheckbox
            isChecked={isAuthChecked}
            onToggle={() => {
              setIsAuthChecked(!isAuthChecked);
            }}
          />
          <SKButton
            marginTop={30}
            fontSize={16}
            fontWeight={'600'}
            backgroundColor={Colors.CLR_EB0000}
            borderColor={Colors.PRIMARY_BORDER}
            title={'SUBMIT'}
            fontStyle="italic"
            onPress={() => {
              if (checkFormValidations()) {
                setIsLoading(true);
                const params = prepareParams();
                refRegister(params, res => {
                  setIsLoading(false);
                  console.log('refRegister res', res);
                  if (res?.status == 1) {
                    navigation.navigate('RoyaltyWallat');
                  }
                });
              }
            }}
          />
        </ScrollView>
        {isBankVisible && banks && (
          <SKModel
            title="Select"
            data={banks}
            keyLabel="institution_name"
            onClose={() => {
              setIsBankVisible(false);
            }}
            onSelect={value => {
              setBank(value);
              setIsBankVisible(false);
            }}
          />
        )}
        {isDatePickerVisible && (
          <SKDatePicker
            originalDate={new Date()}
            maximumDate={new Date()}
            title={'Select date'}
            onCancelPressed={date => {
              setIsDatePickerVisible(false);
              setDOB(date);
            }}
            onDonePressed={date => {
              setDOB(date);
              setIsDatePickerVisible(false);
            }}
          />
        )}

{isProvinceVisible && (
          <SKModel
            title="Select"
            data={provinces}
            keyLabel="state_name"
            onClose={() => {
              setIsProvinceVisible(false);
            }}
            onSelect={value => {
              setProvince(value);
              setIsProvinceVisible(false);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};
const SKCheckbox = props => {
  const {isChecked, onToggle, size = 25} = props;
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
      }}
      onPress={() => {
        onToggle && onToggle();
      }}>
      <Icon
        name={isChecked ? 'check-box-outline' : 'checkbox-blank-outline'}
        size={size}
        color={Colors.APP_BLUE_HEADING_COLOR}
      />
      <Text
        style={{
          color: Colors.RED,
          marginLeft: 10,
          flex: 1,
          fontSize: 15,
          fontWeight: '700',
        }}>
        I agree to the terms and conditions as enclosed here
      </Text>
    </TouchableOpacity>
  );
};

export default RoyaltySignup;
