import React, {useEffect, useState,useRef} from 'react';
import {
  View,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TouchableInput from '../components/TouchableInput';
import SKButton, {UploadDocButton} from '../components/SKButton';
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
  onlineGetMyProfileInfo,
  onlineSaveMyprofile,
  onlineUpdateMyprofile
} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';
import {
  LocalInstsList,
  LocalResidencyListSpouse,
} from '../constants/StaticValues';
import {useIsFocused} from '@react-navigation/native';
import {
  LibImageQualityOptions,
  ImageActionSheetOptions,
} from '../constants/StaticValues';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import SKGGLAddressModel from '../components/SKGGLAddressModel';


const OnlineCompleteReviewProfileV3 = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const pageParams = props.route.params;
  const isEditing = pageParams?.isEditing;
  const depId = pageParams?.dependentOption;
  console.log('pageParams',pageParams)


  const [isFillingForWife, setIsFillingForWife] = useState(false);
  const [lastTime, setLastTime] = useState();
  const [isLastTimeVisible, setIsLastTimeVisible] = useState(false);
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [dob, setDOB] = useState();
  const [gender, setGender] = useState();
  const [sinNo, setSinNo] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState({});
  const [haveDepdents, setHaveDepdents] = useState(false);
  const [isFilingForSpouse, setIsFilingForSpouse] = useState(true);

  const [sfName, setSFName] = useState('');
  const [slName, setSLName] = useState('');
  const [sdob, setSDOB] = useState();
  const [sgender, setSGender] = useState();
  const [ssinNo, setSSinNo] = useState('');
  const [sbank, setSBank] = useState({});
  const [smaritalStatus, setSMaritalStatus] = useState({});
  const [sresidency, setSResidency] = useState({});
  const [saccountNo, setSAccountNo] = useState('');
  const [sbranchNo, setSBranhcNo] = useState('');

  const [enrtyDate, setEnrtyDate] = useState();
  const [residencies, setResidencies] = useState();
  const [bank, setBank] = useState({});
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState('');
  const [branchNo, setBranhcNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState();
  const [isAddViewVisible, setIsAddViewVisible] = useState(false);
  const [isImmDatePickerVisible, setIsImmDatePickerVisible] = useState();
  const [isRelationVisible, setIsRelationVisible] = useState();
  const [isResidenceVisible, setIsResidenceVisible] = useState();
  const [isBankVisible, setIsBankVisible] = useState();
  const [isSBankVisible, setIsSSBankVisible] = useState();
  const actionSheetRef = useRef();
  const [identificationImage, setIdentificationImage] = useState();

  const [isConfirmed, setIsConfirmed] = useState(false);
  const {Tax_Filed_With_Sukhtax, last_marital_status_id = 1} =
    global.onlineStatusData;
  const [taxFileSpouseId, setTaxFileSpouseId] = useState();
  let tax_file_year_id = 0;
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
    const {taxFileCompleted, taxFileID, userID,taxFileStatusID} = pageParams
    console.log('1111=====>', taxFileCompleted, taxFileID, userID,taxFileStatusID);
    if (taxFileCompleted || taxFileStatusID == 16) {
      setIsLoading(true);
      const params = {User_Id: userID, Tax_File_Id: taxFileID};
      onlineGetMyProfileInfo(params, res => {
        console.log('=====>', JSON.stringify(res));
        const details = res?.data[0] || {};
        setFName(details?.user_first_name);
        setLName(details?.user_last_name);
        setSinNo(details?.user_sin_number);
        setDOB(new Date(details?.user_dob));
        setGender(details?.user_gender);
        setMailingAddress(details?.user_mailing_address);
        setBank({
          institution_name: details?.user_institution_name,
          institution_id: details?.user_institution_id,
        });
        setAccountNo(details?.user_account_no);
        setBranhcNo(details?.user_branch);
        setMaritalStatus({
          marital_status_id: details.user_marital_status_id,
          marital_status_name: details.user_marital_status_name,
        });
  
        setSFName(details?.spouse_first_name);
        setSLName(details?.spouse_last_name);
        setSSinNo(details?.user_sin_number);
        setSDOB(new Date(details?.spouse_dob));
        setSGender(details?.spouse_gender);
        setSBank({
          institution_name: details?.spouse_institution_name,
          institution_id: details?.spouse_institution_id,
        });
        setSAccountNo(details?.spouse_account_no);
        setSBranhcNo(details?.spouse_branch);
        setSResidency({
          residency_id: details.spouse_residency_id,
          residency_name: details.spouse_residency,
        });
      });
    }
  }, []);

  // Send """ for spouse bank details if not fling for spouse...
  const prepareParamsForSavingProfile = () => {
    const {taxFileCompleted} = pageParams
    console.log('isProfileUpdate',taxFileCompleted)
    const {user_id} = global.onlineStatusData;
    const params = {
      User_Id: user_id,
      User_First_Name: fName,
      User_Last_Name: lName,
      User_SIN_Number: sinNo,
      User_DOB: dob && format(dob, 'yyyy-MM-dd'),
      User_Gender: gender,
      User_Mailing_Address: mailingAddress,
      User_Institution_Id: bank?.institution_id,
      User_Branch: branchNo,
      User_Account_No: accountNo,
      User_Marital_Status_Id: maritalStatus?.marital_status_id,
      User_Dependents: haveDepdents ? 1 : 0,
      Filing_For_Spouse: isFilingForSpouse ? 1 : 0,
      Spouse_First_Name: sfName,
      Spouse_Last_Name: slName,
      Spouse_DOB: sdob && format(sdob, 'yyyy-MM-dd'),
      Spouse_Gender: sgender,
      Spouse_Residency: sresidency?.residency_name,
      Spouse_SIN_Number: ssinNo,
      Spouse_Institution_Id: sbank?.institution_id,
      Spouse_Branch: sbranchNo,
      Spouse_Account_No: saccountNo,
      Identification_FileNameWithExtension: "test.png",
      File_Base64String: identificationImage
    };
    return params;
  };

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
          details.DOB && setDOB(new Date(details.DOB));
          setGender(details.gender);
          setSinNo(details.SIN_Number);
          setLastTime(details.last_year_filed);
          details.DOE_Canada && setEnrtyDate(new Date(details.DOE_Canada));
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

    // Self Details Validations
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FullName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.FullName);
    const isSinValid =  sinNo.length ?  Validator.isValidSIN(sinNo) : true;
    const isDOBValid = dob;
    const isGenderValid = gender;
    const isValidMailingAddress = mailingAddress?.length;
    const isBankValid = bank?.institution_id > 0;
    const isAccValid = accountNo.length > 0;
    const isBranchValid = branchNo.length == 5;

    // Familiy details validations
    const isMaritalStatus = maritalStatus?.marital_status_id

    // Spouse Details validations
    const isSFNameValid = Validator.isValidField(fName, ST_REGEX.FullName);
    const isSLNameValid = Validator.isValidField(lName, ST_REGEX.FullName);
    const isSGenderValid = gender;
    const isSDOBValid = dob;
    const isSResidencyValid = mailingAddress?.length;
    const isSSinValid =  sinNo.length ?  Validator.isValidSIN(sinNo) : true;
    const isSBankValid = bank?.institution_id > 0;
    const isSAccValid = accountNo.length > 0;
    const isSBranchValid = branchNo.length == 5;
    const isIdentificationImageAttached = identificationImage?.length

     if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter your valid first name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter your valid last name');
    } else if (!isDOBValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select your valid DOB.');
    } else if (!isGenderValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select your valid gender');
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
      Last_Year_Tax_Filed: lastTime || '',
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
      params['Tax_File_Spouse_id'] = taxFileSpouseId || 0;
    }
    if (isFillingForWife) {
      SKTStorage.setKeyValue('showOtherAuthorizer', isFillingForWife, () => {
        global.showOtherAuthorizer = isFillingForWife;
      });
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
        const details = spouseInfoRes?.data[0];
        setLastTime(details.last_year_filed);
        setFName(details.first_name);
        setLName(details.last_name);
        details?.DOB && setDOB(new Date(details.DOB));
        setGender(details.gender);
        setSinNo(flagSin ? '' : details.SIN_Number);
        setLastTime(details.last_year_filed);
        details?.DOE_Canada && setEnrtyDate(new Date(details.DOE_Canada));
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
          if (depId == 1) {
            navigation.push('DependentsList', {
              depCount: 1,
              isEditing: isEditing,
            });
          } else {
            navigation.navigate('MyTaxYear', {
              pageIndex: 0,
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
          <Heading value="MY PROFILE" marginTop={26} />
          <Heading value="ABOUT ME" marginTop={26} fontSize={17} />

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
          <Heading value="MAILING ADDRESS" marginTop={26} fontSize={17} />
          <TouchableInput
            rightAccImage={CustomFonts.ChevronDown}
            marginBottom={2}
            height={65}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={mailingAddress}
            placeholder="Enter Mailing Address"
            onClicked={() => {
              setIsAddViewVisible(true)
            }}
          />
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
          <Heading value="FAMILY" marginTop={26} fontSize={17} />
          <TouchableInput
            marginTop={15}
            leftAccImage={CustomFonts.Gender}
            rightAccImage={CustomFonts.ChevronDown}
            value={maritalStatus?.marital_status_name}
            placeholder="Marital Status"
            onClicked={() => {}}
          />
          <SKSwitch
            fontSize={17}
            marginTop={20}
            isOn={haveDepdents}
            value="Do you have any dependents?"
            onToggle={status => {
              const updated = !haveDepdents;
              setHaveDepdents(updated);
            }}
          />
          <Heading value="SPOUSE" marginTop={26} fontSize={17} />
          <SKSwitch
            fontSize={17}
            marginTop={20}
            isOn={isFilingForSpouse}
            value="DO YOU FILE YOUR RETURN WITH YOUR SPOUSE ?"
            onToggle={status => {
              const updated = !isFilingForSpouse;
              setIsFilingForSpouse(updated);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={sfName}
            placeholder="Enter First Name"
            onEndEditing={value => {
              setSFName(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={slName}
            placeholder="Enter Last Name"
            onEndEditing={value => {
              setSLName(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.Number}
            marginTop={15}
            maxLength={9}
            borderColor={Colors.CLR_0065FF}
            value={ssinNo}
            placeholder="Enter SIN"
            keyboardType="number-pad"
            onEndEditing={value => {
              setSSinNo(value);
            }}
          />
          <TouchableInput
            marginTop={15}
            leftAccImage={CustomFonts.Calender}
            value={sdob && format(sdob, 'dd/MM/yyyy')}
            placeholder="Date of Birth (DD/MM/YYYY)"
            onClicked={() => {
              setIsDatePickerVisible(true);
            }}
          />
          <TouchableInput
            marginTop={15}
            leftAccImage={CustomFonts.Gender}
            rightAccImage={CustomFonts.ChevronDown}
            value={sgender}
            placeholder="Select Gender"
            onClicked={() => {
              setIsGenderVisible(true);
            }}
          />
          <TouchableInput
            rightAccImage={CustomFonts.ChevronDown}
            marginBottom={2}
            height={65}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={sresidency?.residency_name}
            placeholder="Residency"
            onClicked={() => {}}
          />
          {isFilingForSpouse && 
          <>
          
          <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="SPOUSE'S BANKING INFORMATION"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Bank}
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Bank"
          value={sbank?.institution_name}
          onClicked={() => {
            setIsSSBankVisible(true);
          }}
        />
        <SKInput
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          leftAccImage={CustomFonts.Number}
          keyboardType="number-pad"
          value={saccountNo}
          placeholder="Enter Account Number"
          onEndEditing={value => {
            setSAccountNo(value);
          }}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={sbranchNo}
          leftAccImage={CustomFonts.Number}
          keyboardType="number-pad"
          placeholder="Enter Branch Number"
          onEndEditing={value => {
            setSBranhcNo(value);
          }}
        />
        </>
          }
          
          <Heading
            fontSize={16}
            marginTop={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="WE NEED TO VERIFY THAT IT'S REALLY YOU!"
          />
          <Heading
            fontSize={16}
            marginTop={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="PLEASE UPLOAD ONE OF THE FOLLOWING:"
          />
          <Heading
            fontSize={16}
            marginTop={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="- DRIVING LICENCE"
          />
          <Heading
            fontSize={16}
            marginTop={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="- PASSPORT"
          />
          <Heading
            fontSize={16}
            marginTop={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="- PROVINCIAL ID CARD"
          />
          <Heading
            fontSize={16}
            marginTop={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="- CITIZENSHIP CARD"
          />
          <Heading
            fontSize={16}
            marginTop={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="- PR CARD"
          />
          <UploadDocButton
            marginTop={35}
            title="UPLOAD THE DOC HERE"
            height={46}
            onClick={() => {
              actionSheetRef.current.show();
            }}
          />
          <SKButton
            fontSize={16}
            marginTop={20}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'SUBMIT'}
            rightImage={CustomFonts.right_arrow}
            onPress={() => {
              setIsLoading(true)
              const params = prepareParamsForSavingProfile();
              const {taxFileCompleted, taxFileStatusID} = pageParams
              if (taxFileCompleted  && taxFileStatusID != 16) {
                onlineUpdateMyprofile(params, res => {
                  setIsLoading(false)
                  if (res.status == 1) {
                    Alert.alert('Sukhtax',res.message ? res.message : '' )  
                    console.log('res=====>', JSON.stringify(res));
                    navigation.goBack()
                  }else{
                    Alert.alert('Sukhtax','Something went wrong.')  
                  }
                });  
              }else{
                onlineSaveMyprofile(params, res => {
                  setIsLoading(false)
                  if (res.status == 1) {
                    Alert.alert('Sukhtax',res.message ? res.message : '' )  
                    console.log('res=====>', JSON.stringify(res));
                    navigation.goBack()
                  }else{
                    Alert.alert('Sukhtax','Something went wrong.')  
                  }
                });  
              }
            }}
          />
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
      {isAddViewVisible && (
          <SKGGLAddressModel
            onClose={() => {
              setIsAddViewVisible(false);
            }}
            onSelectAddress={value => {
              setMailingAddress(value);
              setIsAddViewVisible(false);
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
      {isSBankVisible && (
        <SKModel
          title="Select"
          data={banks}
          keyLabel="institution_name"
          onClose={() => {
            setIsSSBankVisible(false);
          }}
          onSelect={value => {
            console.log('value',value)
            setSBank(value);
            setIsSSBankVisible(false);
          }}
        />
      )}
      <ActionSheet
          ref={actionSheetRef}
          title={
            <Text style={{color: Colors.GRAY, fontSize: 18}}>
              Which one do you like?
            </Text>
          }
          options={ImageActionSheetOptions}
          onPress={index => {
            setTimeout(() => {
              if (index == 0) {
                launchImageLibrary(LibImageQualityOptions, res => {
                  if (res?.didCancel) {
                    Alert.alert(
                      'SukhTax',
                      'Image uploading cancelled by user.',
                    );
                  } else if (res?.error) {
                  } else if (res?.assets) {
                    console.log('res',res)
                    const imgObj = res?.assets?.[0];
                    if (!imgObj.base64) Alert.alert('SukhTax', 'Something went wrong!');
                    console.log('imgObj.11111',imgObj.base64)
                    setIdentificationImage(imgObj.base64)
                  }
                });
              } else if (index == 1) {
                launchCamera(LibImageQualityOptions, res => {
                  if (res?.didCancel) {
                    Alert.alert(
                      'SukhTax',
                      'Image uploading cancelled by user.',
                    );
                  } else if (res?.error) {
                  } else if (res?.assets) {
                    const imgObj = res?.assets?.[0];
                    if (!imgObj.base64) Alert.alert('SukhTax', 'Something went wrong!');
                    console.log('imgObj.22222',imgObj.base64)
                    setIdentificationImage(imgObj.base64)
                  }
                });
              } else if (index == 2) {
                setTimeout(
                  () => {
                    DocumentPicker.pick({
                      type: [DocumentPicker.types.pdf],
                    })
                      .then(res => {
                        const fileRes = res[0];
                        console.log(fileRes)
                        const imgObj = fileRes?.assets?.[0];
                        if (!imgObj.base64) Alert.alert('SukhTax', 'Something went wrong!');
                        console.log('imgObj.3333',imgObj.base64)
                        setIdentificationImage(imgObj.base64)
                      })
                      .catch(err => {
                        console.log('err', err);
                      });
                  },
                  Platform.OS === 'ios' ? 300 : 0,
                );
              }
            }, 100);
          }}
        />
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
          setIsBankingChanged(tag == 2 ? true : false);
        }}
      />
      <ButtonCard
        title="HAS YOUR SIN NUMBER CHANGED SINCE LAST YEAR?"
        isSelected={isSINChanged ? true : false}
        onOptionSelected={tag => {
          setIsSINChanged(tag == 2 ? true : false);
        }}
      />
      <ButtonCard
        title="HAS YOUR SPOUSE RESIDENCY CHANGED SINCE LAST YEAR?"
        isSelected={isResidencyChanged ? true : false}
        onOptionSelected={tag => {
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
      <Heading fontSize={20} marginTop={30} value={title} />
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
export default OnlineCompleteReviewProfileV3;
