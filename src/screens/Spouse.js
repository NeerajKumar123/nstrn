import React, {useEffect, useState} from 'react';
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
  Dimensions,
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKSwitch from '../components/SKSwitch';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import AppHeader from '../components/AppHeader';
import {
  GENDER_OPTIONS,
  RELATIONS,
  TIME_OPTIONS,
} from '../constants/StaticValues';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {
  getResidencyList,
  getInstitutionList,
  saveSpouseInfo,
} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const {width} = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';

const Spouse = props => {
  const navigation = useNavigation();
  const [isFillingForWife, setIsFillingForWife] = useState(false);
  const [lastTime, setLastTime] = useState();
  const [isLastTimeVisible, setIsLastTimeVisible] = useState(false);
  const [fName, setFName] = useState('spousename');
  const [lName, setLName] = useState('spousenamelast');
  const [dob, setDOB] = useState();
  const [gender, setGender] = useState();
  const [sinNo, setSinNo] = useState('');
  const [enrtyDate, setEnrtyDate] = useState();
  const [relation, setRelation] = useState('');
  const [residency, setResidency] = useState('');
  const [residencies, setResidencies] = useState();
  const [bank, setBank] = useState('');
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState('7654321');
  const [branchNo, setBranhcNo] = useState('12345');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState();
  const [isImmDatePickerVisible, setIsImmDatePickerVisible] = useState();
  const [isRelationVisible, setIsRelationVisible] = useState();
  const [isResidenceVisible, setIsResidenceVisible] = useState();
  const [isBankVisible, setIsBankVisible] = useState();

  useEffect(() => {
    setIsLoading(true);
    getInstitutionList({}, instRes => {
      console.log('instRes', instRes);
      setBanks(instRes?.data);
      setBank(instRes?.data?.[0]);
      getResidencyList({}, resdencyRes => {
        console.log('resdencyRes', resdencyRes);
        setResidencies(resdencyRes?.data);
        setResidency(resdencyRes?.data?.[0]);
        setIsLoading(false);
      });
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isValidLastYear = lastTime;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.LName);
    const isDOBValid = dob;
    const isGenderValid = gender;
    const isResidencyValid = residency?.residency_id > 0;
    const isSinValid = sinNo.length > 0;
    const isEnrtyDateValid = enrtyDate;
    const isBankValid = bank?.institution_id > 0;
    const isAccValid = accountNo.length > 5;
    const isBranchValid = branchNo.length > 4;
    console.log('lastTime',lastTime)
    if (!isValidLastYear) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isValidLastYear');
    } else if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid First Name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isLNameValid');
    } else if (!isDOBValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isDOBValid');
    } else if (!isGenderValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isGenderValid');
    } else if (!isResidencyValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isResidencyValid');
    } else if (!isSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isSinValid');
    } else if (!isEnrtyDateValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isEnrtyDateValid');
    } else if (!isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isBankValid');
    } else if (!isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isAccValid');
    } else if (!isBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'isBranchValid');
    }
    return isValidForm;
  };

  const prepareParams = () => {
    const {
      user_id,
      tax_file_id = 83,
      Tax_File_Id,
      tax_file_year_id,
    } = global.userInfo;
    const params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id || Tax_File_Id,
      Tax_File_Year_Id: tax_file_year_id,
      Last_Year_Tax_Filed: 2020,
      First_Name: fName,
      Last_Name: lName,
      DOB: dob && format(dob, 'yyyy-MM-dd'),
      Gender: gender,
      SIN_Number: sinNo,
      Date_of_Entry_in_Canada: enrtyDate && format(enrtyDate, 'yyyy-MM-dd'),
      Institution_Id: bank?.institution_id,
      Branch: branchNo,
      Account_No: accountNo,
      Residency: residency?.residency_name,
      Filing_For_Spouse: isFillingForWife ? 1 : 0,
    };
    return params;
  };

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        paddingBottom: Platform.OS == 'ios' ? 20 : 0,
      }}>
      {isLoading && <SKLoader />}
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading value="SPOUSE" marginTop={26} />
        <SKSwitch
          fontSize={20}
          marginTop={20}
          isOn={isFillingForWife}
          value="ARE YOU FILLING FOR YOUR SPOUSE?"
          onToggle={status => {
            console.log(status);
            setIsFillingForWife(!isFillingForWife);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Clock}
          rightAccImage={CustomFonts.ChevronDown}
          value={lastTime}
          placeholder="Select"
          onClicked={() => {
            console.log('sdsd');
            setIsLastTimeVisible(true);
          }}
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
          value={dob && format(dob, 'dd/MM/yyyy')}
          placeholder="Date of Birth (DD/MM/YYYY)"
          onClicked={() => {
            setIsDatePickerVisible(true);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Gender}
          rightAccImage={CustomFonts.ChevronDown}
          value={gender}
          placeholder="Select Gender"
          onClicked={() => {
            console.log('sdsd');
            setIsGenderVisible(true);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Home}
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Residency"
          value={residency?.residency_name}
          onClicked={() => {
            console.log('sdsd');
            setIsResidenceVisible(true);
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
          leftAccImage={CustomFonts.Calender}
          value={enrtyDate && format(enrtyDate, 'dd/MM/yyyy')}
          placeholder="Date of Immigration (DD/MM/YYYY)"
          onClicked={() => {
            setIsImmDatePickerVisible(true);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="BANKING INFORMATION"
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
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={accountNo}
          placeholder="#Enter Account Number"
          onEndEditing={value => {
              setAccountNo(value)
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
            setBranhcNo(value)
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'DEPENDENTS'}
          onPress={() => {
            console.log('link pressed');
            if (checkFormValidations()) {
              const params = prepareParams();
              saveSpouseInfo(params, spouseRes => {
                if (spouseRes?.status == 1) {
                  navigation.navigate('Dependents');
                } else {
                  Alert.alert('SukhTax', 'Something wrong!');
                }
              });
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
              setDOB(selectedDate);
              console.log('====>', format(selectedDate, 'dd/MM/yyyy'));
              setIsDatePickerVisible(false);
            }}
          />
        </View>
      )}
      {isImmDatePickerVisible && (
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
              setEnrtyDate(selectedDate);
              setIsImmDatePickerVisible(false);
            }}
          />
        </View>
      )}
      {isLastTimeVisible && (
        <SKModel
          title="Select"
          data={TIME_OPTIONS}
          onClose={() => {
            setIsLastTimeVisible(false);
          }}
          onSelect={value => {
            console.log('value', value);
            setLastTime(value);
            setIsLastTimeVisible(false);
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
            console.log('value', value);
            setGender(value);
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
            setRelation(value);
            setIsRelationVisible(false);
          }}
        />
      )}

      {isResidenceVisible && (
        <SKModel
          title="Select"
          data={residencies}
          keyLabel="residency_name"
          onClose={() => {
            setIsResidenceVisible(false);
          }}
          onSelect={value => {
            setResidency(value);
            setIsResidenceVisible(false);
          }}
        />
      )}
      {isBankVisible && (
        <SKModel
          title="Select"
          data={banks}
          keyLabel="institution_name"
          onClose={() => {
            setIsBankVisible(false);
          }}
          onSelect={value => {
            console.log('setIsBankVisible', value);
            setBank(value);
            setIsBankVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default Spouse;
