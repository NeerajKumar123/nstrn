import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
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
  getSpouseResidencyList,
  getInstitutionList,
  saveSpouseInfo,
  onlineGetSpouseInfoByUserId,
  onlineGetSpouseInfo,
  updateSpouseInfo,
} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';
import {
  LocalInstsList,
  LocalResidencyListSpouse,
} from '../constants/StaticValues';
import {useIsFocused} from '@react-navigation/native';

const Spouse = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const pageParams = props.route.params;
  const isEditing = pageParams?.isEditing;
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
  const [bank, setBank] = useState({});
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
  const {Tax_Filed_With_Sukhtax, last_marital_status_id = 1} = global.onlineStatusData;
  const [taxFileSpouseId, setTaxFileSpouseId] = useState();
  let tax_file_year_id = 0;
  console.log('global.onlineStatusData',global.onlineStatusData)
  //check if  in editing  mode then pick from server data only
  if (isEditing) {
    const {Year_Wise_Records} = global.onlineStatusData;
    if (Year_Wise_Records && Year_Wise_Records.length > 0) {
      const singYear = Year_Wise_Records[0] || {};
      tax_file_year_id = singYear.tax_file_year_id;
    }
  } else {
    SKTStorage.getValue('tax_file_year_id', id => {
      tax_file_year_id = id;
    });
  }

  useEffect(() => {
    setIsLoading(true);
    getInstitutionList({}, instRes => {
      setBanks(instRes?.data);
      getSpouseResidencyList({}, resdencyRes => {
        if (resdencyRes.status == 1) {
          setResidencies(resdencyRes?.data);
        } else {
          setResidencies(LocalResidencyListSpouse);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
    });
  }, []);

  useEffect(() => {
    if (isFocused && isEditing) {
      const {tax_file_id, user_id} = global.onlineStatusData;
      const params = {
        User_Id: user_id,
        Tax_File_Id: tax_file_id,
      };
      onlineGetSpouseInfo(params, spouseInfoRes => {
        const details = spouseInfoRes.data[0];
        if (details) {
          setLastTime(details.last_year_filed);
          setFName(details.first_name);
          setLName(details.last_name);
          setDOB(new Date(details.DOB));
          setGender(details.gender);
          setSinNo(details.SIN_Number);
          setLastTime(details.last_year_filed);
          setEnrtyDate(new Date(details.DOE_Canada));
          setResidency({
            residency_id: details.residency_id,
            residency_name: details.residency,
          });
          setBank({
            institution_name: details.institution_name,
            institution_id: details.institution_id,
          });
          setAccountNo(details.account_no);
          setBranhcNo(details.branch);
          const isFilingS = details.Filing_For_Spouse ? true : false;
          setIsFillingForWife(isFilingS);
          setTaxFileSpouseId(details.tax_file_spouse_id);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
    }
  }, [isFocused]);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isValidLastYear = lastTime;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FullName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.FullName);
    const isDOBValid = dob;
    const isGenderValid = gender;
    const isResidencyValid = residency?.residency_id > 0;
    const isSinValid =
      residency?.residency_id != 5 ? Validator.isValidSIN(sinNo) : true;
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
    const {user_id, tax_file_id} = global.onlineStatusData;
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
      Institution_Id: bank?.institution_id ? bank?.institution_id : 0,
      Branch: branchNo,
      Account_No: accountNo,
      Residency: residency?.residency_name,
      Filing_For_Spouse: isFillingForWife ? 1 : 0,
    };
    if (isEditing) {
      params['Tax_File_Spouse_id'] = taxFileSpouseId;
    }
    return params;
  };

  const getLastYearData = (
    flagBank,
    flagSin,
    flagResidency,
    flagSpouseFiling,
  ) => {
    setIsLoading(true);
    const {user_id} = global.onlineStatusData;
    onlineGetSpouseInfoByUserId({User_Id: user_id}, spouseInfoRes => {
      if (spouseInfoRes.status == 1) {
        const details = spouseInfoRes?.data[0] || {};
        setLastTime(details.last_year_filed);
        setFName(details.first_name);
        setLName(details.last_name);
        setDOB(new Date(details.DOB));
        setGender(details.gender);
        setSinNo(flagSin ? '' : details.SIN_Number);
        setLastTime(details.last_year_filed);
        setEnrtyDate(new Date(details.DOE_Canada));
        const filtered = residencies?.filter(element => {
          return element.residency_name == details.residency;
        });
        setResidency(flagResidency ? {} : filtered[0]);
        setBank(
          flagBank
            ? {}
            : {
                institution_name: details.institution_name,
                institution_id: details.institution_id,
              },
        );
        setAccountNo(flagBank ? '' : details.account_no);
        setBranhcNo(flagBank ? '' : details.branch);
        setIsConfirmed(true);
        setIsFillingForWife(flagSpouseFiling);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    });
  };

  const handleSaveAndUpdateInfo = () => {
    if (!isEditing) {
      setIsLoading(true);
      const params = prepareParams();
      saveSpouseInfo(params, spouseRes => {
        if (spouseRes?.status == 1) {
          navigation.push('DependentsList', {
            depCount: 1,
            isEditing: isEditing,
          });
        } else {
          Alert.alert('SukhTax', 'Something went wrong!');
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
    } else {
      setIsLoading(true);
      const params = prepareParams();
      updateSpouseInfo(params, spouseRes => {
        if (spouseRes?.status == 1) {
          if (isEditing) {
            navigation.navigate('OnlineEditInfo');
          } else {
            navigation.push('DependentsList', {
              depCount: 1,
              isEditing: isEditing,
            });
          }
        } else {
          Alert.alert('SukhTax', 'Something went wrong!');
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
    }
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
          {console.log('Tax_Filed_With_Sukhtax',Tax_Filed_With_Sukhtax, last_marital_status_id,isEditing,isConfirmed)}
          {Tax_Filed_With_Sukhtax && (last_marital_status_id == 2 || last_marital_status_id == 3)  && !isEditing && !isConfirmed ? (
            <LastYearDataCard
              onContinuePressed={(
                flagBank,
                flagSin,
                flagResidency,
                flagSpouseFiling,
              ) => {
                getLastYearData(
                  flagBank,
                  flagSin,
                  flagResidency,
                  flagSpouseFiling,
                );
              }}
            />
          ) : (
            <>
              <SKSwitch
                fontSize={20}
                marginTop={20}
                isOn={isFillingForWife}
                value="ARE YOU FILING FOR YOUR SPOUSE?"
                onToggle={status => {
                  const updated = !isFillingForWife
                  setIsFillingForWife(updated);
                  SKTStorage.setKeyValue('showOtherAuthorizer',updated,()=>{
                    global.showOtherAuthorizer = updated
                  })
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
                marginTop={15}
                leftAccImage={CustomFonts.Calender}
                value={dob && format(dob, 'dd/MM/yyyy')}
                placeholder="Date of Birth (DD/MM/YYYY)"
                onClicked={() => {
                  setIsDatePickerVisible(true);
                }}
              />
              <TouchableInput
                marginTop={15}
                leftAccImage={CustomFonts.Gender}
                rightAccImage={CustomFonts.ChevronDown}
                value={gender}
                placeholder="Select Gender"
                onClicked={() => {
                  setIsGenderVisible(true);
                }}
              />
              <TouchableInput
                marginTop={15}
                leftAccImage={CustomFonts.Home}
                rightAccImage={CustomFonts.ChevronDown}
                placeholder="Select Residency"
                value={residency?.residency_name}
                onClicked={() => {
                  setIsResidenceVisible(true);
                }}
              />
              {residency?.residency_id != 5 && (
                <SKInput
                  leftAccImage={CustomFonts.Number}
                  marginTop={15}
                  maxLength={9}
                  borderColor={Colors.CLR_0065FF}
                  value={sinNo}
                  placeholder="Enter SIN"
                  keyboardType="number-pad"
                  onEndEditing={value => {
                    setSinNo(value);
                  }}
                />
              )}

              <TouchableInput
                marginTop={15}
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
                title={isEditing ? 'SUBMIT' : 'DEPENDENTS'}
                onPress={() => {
                  if (checkFormValidations()) {
                    handleSaveAndUpdateInfo();
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

      {isResidenceVisible && residencies && (
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

const LastYearDataCard = props => {
  const {onContinuePressed = () => {}} = props;
  const [isBankingChanged, setIsBankingChanged] = useState(true);
  const [isSINChanged, setIsSINChanged] = useState(true);
  const [isResidencyChanged, setIsResidencyChanged] = useState(true);
  const [isFilingForSpouse, setIsFilingForSpouse] = useState(true);

  return (
    <>
      <ButtonCard
        title="HAS YOUR BANKING INFO CHANGED SINCE LAST YEAR?"
        isSelected={isBankingChanged ? true : false}
        onOptionSelected={tag => {
          console.log('tag===>', tag);
          setIsBankingChanged(tag == 2 ? true : false);
        }}
      />
      <ButtonCard
        title="HAS YOUR SIN NUMBER CHANGED SINCE LAST YEAR?"
        isSelected={isSINChanged ? true : false}
        onOptionSelected={tag => {
          console.log('tag===>', tag);
          setIsSINChanged(tag == 2 ? true : false);
        }}
      />
      <ButtonCard
        title="HAS YOUR SPOUSE RESIDENCY CHANGED SINCE LAST YEAR?"
        isSelected={isResidencyChanged ? true : false}
        onOptionSelected={tag => {
          console.log('tag===>', tag);
          setIsResidencyChanged(tag == 2 ? true : false);
        }}
      />
      <ButtonCard
        title="ARE YOU FILING FOR YOUR SPOUSE THIS YEAR?"
        isSelected={isFilingForSpouse ? true : false}
        onOptionSelected={tag => {
          setIsFilingForSpouse(tag == 2 ? true : false);
        }}
      />
      <SKButton
        fontSize={16}
        marginTop={30}
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.PRIMARY_BORDER}
        title={'CONTINUE'}
        onPress={() => {
          onContinuePressed(
            isBankingChanged,
            isSINChanged,
            isResidencyChanged,
            isFilingForSpouse,
          );
        }}
      />
    </>
  );
};

const ButtonCard = props => {
  const {title, isSelected = false, onOptionSelected = () => {}} = props;
  return (
    <>
      <Heading fontSize={20} marginTop={30} color={Colors.RED} value={title} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Button
          title={'NO'}
          isSelected={!isSelected}
          onSelected={() => {
            onOptionSelected(1);
          }}
        />
        <Button
          title={'YES'}
          isSelected={isSelected}
          onSelected={() => {
            onOptionSelected(2);
          }}
        />
      </View>
    </>
  );
};

const Button = props => {
  const {title = 'yes', isSelected = false, onSelected = () => {}} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: isSelected ? Colors.LIGHTGRAY : Colors.CLR_E77C7E,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      key={`${Math.random()}`}
      onPress={() => {
        onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 17,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export default Spouse;
