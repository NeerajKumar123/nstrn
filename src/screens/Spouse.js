import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKSwitch from '../components/SKSwitch';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import SKDatePicker from '../components/SKDatePicker';
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
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';

const Spouse = props => {
  const navigation = useNavigation();
  const [isFillingForWife, setIsFillingForWife] = useState(false);
  const [lastTime, setLastTime] = useState();
  const [isLastTimeVisible, setIsLastTimeVisible] = useState(false);
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [dob, setDOB] = useState();
  const [gender, setGender] = useState();
  const [sinNo, setSinNo] = useState('');
  const [enrtyDate, setEnrtyDate] = useState();
  const [relation, setRelation] = useState('');
  const [residency, setResidency] = useState('');
  const [residencies, setResidencies] = useState();
  const [bank, setBank] = useState('');
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState('');
  const [branchNo, setBranhcNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState();
  const [isImmDatePickerVisible, setIsImmDatePickerVisible] = useState();
  const [isRelationVisible, setIsRelationVisible] = useState();
  const [isResidenceVisible, setIsResidenceVisible] = useState();
  const [isBankVisible, setIsBankVisible] = useState();
  const [isConfirmed, setIsConfirmed] = useState(false);
  // const { Tax_Filed_With_Sukhtax } = global.onlineStatusData;
  const Tax_Filed_With_Sukhtax = 1;

  useEffect(() => {
    setIsLoading(true);
    getInstitutionList({}, instRes => {
      setBanks(instRes?.data);
      setBank(instRes?.data?.[0]);
      getResidencyList({}, resdencyRes => {
        setResidencies(resdencyRes?.data);
        setResidency(resdencyRes?.data?.[0]);
        setIsLoading(false);
      });
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isValidLastYear = lastTime;
    const isFNameValid = Validator.isValidField(fName,ST_REGEX.FullName)
    const isLNameValid = Validator.isValidField(lName,ST_REGEX.FullName)
    const isDOBValid = dob;
    const isGenderValid = gender;
    const isResidencyValid = residency?.residency_id > 0;
    const isSinValid = Validator.isValidSIN(sinNo);
    const isEnrtyDateValid = enrtyDate;
    const isBankValid = bank?.institution_id > 0;
    const isAccValid = accountNo.length > 0;
    const isBranchValid = branchNo.length == 5;
    if (!isValidLastYear) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid year');
    } else if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid first name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid last name');
    } else if (!isDOBValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid DOB.');
    } else if (!isGenderValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid gender');
    } else if (!isResidencyValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid residency');
    } else if (!isSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid SIN');
    } else if (false && !isEnrtyDateValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid Date Of Immigration');
    } else if (isFillingForWife && !isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select a valid bank');
    } else if (isFillingForWife && !isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account number');
    } else if (isFillingForWife && !isBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid branch number');
    }
    return isValidForm;
  };

  const prepareParams = () => {
    const {user_id, tax_file_id, tax_file_year_id} = global.onlineStatusData;

    const params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id || Tax_File_Id,
      Tax_File_Year_Id: tax_file_year_id,
      Last_Year_Tax_Filed: lastTime,
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
        flex: 1,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled={true}
        style={{flex: 1, width: '100%', paddingBottom: 10}}
        keyboardVerticalOffset={0}>
        {isLoading && <SKLoader />}
        <AppHeader navigation={navigation} />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}>
          <Heading value="SPOUSE" marginTop={26} />
          {Tax_Filed_With_Sukhtax && !isConfirmed ? (
            <>
              <Heading
                fontSize={20}
                marginTop={30}
                color={Colors.RED}
                value="BANKING INFO SAME AS LAST YEAR?"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 30,
                }}>
                <SKButton
                  width={'48%'}
                  fontSize={16}
                  fontWeight={'normal'}
                  backgroundColor={Colors.CLR_7F7F9F}
                  borderColor={Colors.CLR_D3D3D9}
                  title={'NO'}
                  onPress={() => {
                    console.log('NO clicked');
                    setIsLoading(true);
                    const {user_id} = global.onlineStatusData;
                    onlineGetAboutInfoByYear({User_Id: user_id}, infoRes => {
                      if (infoRes.status == 1) {
                        const details = infoRes.data[0];
                        setsin(details.SIN_number);
                        setgender(details.gender);
                        setDOB(new Date(details.DOB));
                        setIsSinChanged(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 500);
                      }
                    });
                  }}
                />
                <SKButton
                  fontSize={16}
                  width={'48%'}
                  fontWeight={'normal'}
                  backgroundColor={Colors.PRIMARY_BORDER}
                  borderColor={Colors.PRIMARY_FILL}
                  title={'YES'}
                  onPress={() => {
                    console.log('YES clicked');
                    setIsSinChanged(true);
                  }}
                />
              </View>
              <Heading
                fontSize={20}
                marginTop={30}
                color={Colors.RED}
                value="SIN NUMBER SAME AS LAST YEAR?"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 30,
                }}>
                <SKButton
                  width={'48%'}
                  fontSize={16}
                  fontWeight={'normal'}
                  backgroundColor={Colors.CLR_7F7F9F}
                  borderColor={Colors.CLR_D3D3D9}
                  title={'NO'}
                  onPress={() => {
                    console.log('NO clicked');
                    setIsLoading(true);
                    const {user_id} = global.onlineStatusData;
                    onlineGetAboutInfoByYear({User_Id: user_id}, infoRes => {
                      if (infoRes.status == 1) {
                        const details = infoRes.data[0];
                        setsin(details.SIN_number);
                        setgender(details.gender);
                        setDOB(new Date(details.DOB));
                        setIsSinChanged(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 500);
                      }
                    });
                  }}
                />
                <SKButton
                  fontSize={16}
                  width={'48%'}
                  fontWeight={'normal'}
                  backgroundColor={Colors.PRIMARY_BORDER}
                  borderColor={Colors.PRIMARY_FILL}
                  title={'YES'}
                  onPress={() => {
                    console.log('YES clicked');
                    setIsSinChanged(true);
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <SKSwitch
                fontSize={20}
                marginTop={20}
                isOn={isFillingForWife}
                value="ARE YOU FILING FOR YOUR SPOUSE?"
                onToggle={status => {
                  setIsFillingForWife(!isFillingForWife);
                }}
              />
              <TouchableInput
                leftAccImage={CustomFonts.Clock}
                rightAccImage={CustomFonts.ChevronDown}
                value={lastTime}
                placeholder="Select Year"
                onClicked={() => {
                  setIsLastTimeVisible(true);
                }}
              />
              <SKInput
                leftAccImage={CustomFonts.UserIcon}
                maxLength={30}
                borderColor={Colors.CLR_0065FF}
                value={fName}
                placeholder="Enter First Name"
                onEndEditing={value => {
                  setFName(value);
                }}
              />
              <SKInput
                leftAccImage={CustomFonts.UserIcon}
                maxLength={30}
                borderColor={Colors.CLR_0065FF}
                value={lName}
                placeholder="Enter Last Name"
                onEndEditing={value => {
                  setLName(value);
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
              <TouchableInput
                leftAccImage={CustomFonts.Gender}
                rightAccImage={CustomFonts.ChevronDown}
                value={gender}
                placeholder="Select Gender"
                onClicked={() => {
                  setIsGenderVisible(true);
                }}
              />
              <TouchableInput
                leftAccImage={CustomFonts.Home}
                rightAccImage={CustomFonts.ChevronDown}
                placeholder="Select Residency"
                value={residency?.residency_name}
                onClicked={() => {
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
                keyboardType="number-pad"
                onEndEditing={value => {
                  setSinNo(value);
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
              {isFillingForWife && (
                <>
                  <Heading
                    fontSize={20}
                    marginTop={20}
                    color={Colors.APP_RED_SUBHEADING_COLOR}
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
                    marginBottom={0}
                    maxLength={30}
                    borderColor={Colors.CLR_0065FF}
                    leftAccImage={CustomFonts.Number}
                    keyboardType="number-pad"
                    value={accountNo}
                    placeholder="Enter Account Number"
                    onEndEditing={value => {
                      setAccountNo(value);
                    }}
                  />
                  <SKInput
                    marginTop={20}
                    marginBottom={0}
                    maxLength={30}
                    borderColor={Colors.CLR_0065FF}
                    value={branchNo}
                    leftAccImage={CustomFonts.Number}
                    keyboardType="number-pad"
                    placeholder="Enter Branch Number"
                    onEndEditing={value => {
                      setBranhcNo(value);
                    }}
                  />
                </>
              )}
              <SKButton
                marginTop={30}
                fontSize={16}
                rightImage={CustomFonts.right_arrow}
                fontWeight={'normal'}
                backgroundColor={Colors.PRIMARY_FILL}
                borderColor={Colors.PRIMARY_BORDER}
                title={'DEPENDENTS'}
                onPress={() => {
                  if (checkFormValidations()) {
                    setIsLoading(true);
                    const params = prepareParams();
                    saveSpouseInfo(params, spouseRes => {
                      setIsLoading(false);
                      if (spouseRes?.status == 1) {
                        SKTStorage.setKeyValue('isFromSpouseFlow', true, () => {
                          navigation.push('Dependents', {depCount: 1});
                        });
                      } else {
                        Alert.alert('SukhTax', 'Something went wrong!');
                      }
                    });
                  }
                }}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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

      {isImmDatePickerVisible && (
        <SKDatePicker
          originalDate={new Date()}
          title={'Select date'}
          maximumDate={new Date()}
          onCancelPressed={date => {
            setIsImmDatePickerVisible(false);
            setEnrtyDate(date);
          }}
          onDonePressed={date => {
            setEnrtyDate(date);
            setIsImmDatePickerVisible(false);
          }}
        />
      )}
      {isLastTimeVisible && (
        <SKModel
          title="Select"
          data={TIME_OPTIONS}
          onClose={() => {
            setIsLastTimeVisible(false);
          }}
          onSelect={value => {
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
            setBank(value);
            setIsBankVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default Spouse;
