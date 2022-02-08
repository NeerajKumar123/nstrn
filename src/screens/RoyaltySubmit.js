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
import SKDatePicker from '../components/SKDatePicker';
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
  const [insNumber, setInsNumber] = useState();
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
    const params = {};
    getCanadaProvinceList(params, provinceRes => {
      setIsLoading(false);
      setProvinces(provinceRes?.data);
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isInsNumberValid = insNumber?.length >= 3;
    const isAccValid = accountNo?.length;
    const isBranchValid = branchNo?.length == 5;

    const isAccountHolderNameValid = true;
    const isdobValid = true;
    const isCityValid = true;
    const isProvinceValid = true;
    const isPostalCodeValid = postal?.length < 7 && postal?.length > 5;
    const isAddLine1Valid = addLine1?.length > 5;
    const isAddLine2Valid = true;

    if (!isInsNumberValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Institution Number.');
    } else if (!isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account number.');
    } else if (!isBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid branch code.');
    } else if (!isAccountHolderNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account holder name.');
    } else if (!isdobValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid DOB.');
    } else if (!isCityValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid city.');
    } else if (!isProvinceValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid province.');
    } else if (!isPostalCodeValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid postal code.');
    } else if (!isAddLine1Valid) {
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

  const prepareParams = () => {
    const {user_id} = global.onlineStatusData;
    const params = {
      User_Id: user_id,
      Institiution_Number: insNumber,
      Account_Number: accountNo,
      Branch_Number: branchNo,
      Account_Holder_Name: accountHolderName,
      DOB: dob && format(dob, 'yyyy-MM-dd'),
      Address_City: city,
      Address_State: province?.state_name,
      Address_PostalCode: postal,
      Address_Line1: addLine1,
      Address_Line2: addLine2 || '',
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
          <SKInput
            marginTop={10}
            leftAccImage={CustomFonts.Number}
            borderColor={Colors.CLR_0065FF}
            value={insNumber}
            maxLength={3}
            keyboardType="number-pad"
            placeholder="Enter Institution Number"
            onEndEditing={value => {
              setInsNumber(value);
            }}
          />
          <SKInput
            marginTop={10}
            maxLength={30}
            leftAccImage={CustomFonts.Number}
            borderColor={Colors.CLR_0065FF}
            value={accountNo}
            maxLength={15}
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
            maxLength={5}
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
            leftAccImage={CustomFonts.UserIcon}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={accountHolderName}
            placeholder="Enter Account Holder Name"
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
            leftAccImage={CustomFonts.Home}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={city}
            placeholder="Enter City"
            onEndEditing={value => {
              setCity(value);
            }}
          />
          <TouchableInput
            rightAccImage={CustomFonts.ChevronDown}
            marginBottom={2}
            leftAccImage={CustomFonts.Home}
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
            maxLength={7}
            borderColor={Colors.CLR_0065FF}
            value={postal}
            autoCapitalize="characters"
            placeholder="Enter Postal Code"
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
            placeholder="Address Line 1"
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
            placeholder="Address Line 2"
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
          {Platform.OS == 'android' && (
            <View style={{height: 100, width: '100%'}} />
          )}
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
                  if (res?.status == 1) {
                    navigation.navigate('RoyaltyWallat');
                  } else {
                    const msg =
                      res?.message ??
                      'Something went wront, Please try again later.';
                    Alert.alert('SukhTax', msg);
                  }
                });
              }
            }}
          />
        </ScrollView>
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

        {isProvinceVisible && provinces && (
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
  const {
    isChecked,
    onToggle,
    size = 25,
    color = Colors.APP_RED_SUBHEADING_COLOR,
  } = props;
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
          color: color,
          marginLeft: 10,
          flex: 1,
          fontSize: 15,
          fontWeight: '500',
        }}>
        I agree to the terms and conditions as enclosed here.
      </Text>
    </TouchableOpacity>
  );
};

export default RoyaltySignup;
