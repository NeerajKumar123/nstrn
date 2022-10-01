import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
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
  onlineGetMyProfileInfo,
  onlineSaveMyprofile,
  onlineUpdateMyprofile,
  getMaritalStatusList,
  getResidencyList
} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';
import {LocalResidencyListSpouse} from '../constants/StaticValues';
import {useIsFocused} from '@react-navigation/native';
import {
  LibImageQualityOptions,
  ImageActionSheetOptions,
} from '../constants/StaticValues';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import DocumentPicker from 'react-native-document-picker';
import SKGGLAddressModel from '../components/SKGGLAddressModel';

const OnlineCompleteReviewProfileV3 = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const {statusDetails} = pageParams
  const [isFillingForWife, setIsFillingForWife] = useState(false);
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
  const [sresidency, setSResidency] = useState({});
  const [saccountNo, setSAccountNo] = useState('');
  const [sbranchNo, setSBranhcNo] = useState('');

  const [residencies, setResidencies] = useState();
  const [bank, setBank] = useState({});
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState('');
  const [branchNo, setBranhcNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState();
  const [isSGenderVisible, setIsSGenderVisible] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState();
  const [isSDatePickerVisible, setIsSDatePickerVisible] = useState();
  const [isAddViewVisible, setIsAddViewVisible] = useState(false);
  const [isImmDatePickerVisible, setIsImmDatePickerVisible] = useState();
  const [isSResidenceVisible, setIsSResidenceVisible] = useState();
  const [isBankVisible, setIsBankVisible] = useState();
  const [isSBankVisible, setIsSSBankVisible] = useState();
  const actionSheetRef = useRef();
  const [identificationImage, setIdentificationImage] = useState();
  const [identificationImageName, setIdentificationImageName] = useState();
  const [maritalStatuses, setMaritalStatuses] = useState();
  const [isMVisible, setIsMVisible] = useState();


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
    setIsLoading(true)
    getMaritalStatusList({}, maritalRes => {
      setMaritalStatuses(maritalRes?.data);
      setIsLoading(false)
    });
  }, []);

  useEffect(() => {
    const {tax_profile_completed, tax_file_id, user_id, tax_file_status_id} = statusDetails;
    if (tax_profile_completed || tax_file_status_id == 16) {
      setIsLoading(true);
      const params = {User_Id: user_id, Tax_File_Id: tax_file_id};
      onlineGetMyProfileInfo(params, res => {
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
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
    }
  }, []);

  // Send "" for spouse bank details if not fling for spouse...
  const prepareParamsForSavingProfile = () => {
    const {user_id} = statusDetails;
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
      Spouse_Institution_Id: isFilingForSpouse ? sbank?.institution_id : 0,
      Spouse_Branch: sbranchNo,
      Spouse_Account_No: saccountNo,
      Identification_FileNameWithExtension: identificationImageName || `${user_id}_online_new.png`,
      File_Base64String: identificationImage,
    };
    return params;
  };

  const checkFormValidations = () => {
    let isValidForm = true;

    // Self Details Validations
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FullName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.FullName);
    const isSinValid = sinNo.length ? Validator.isValidSIN(sinNo) : true;
    const isDOBValid = dob;
    const isGenderValid = gender;
    const isValidMailingAddress = mailingAddress?.length;
    const isBankValid = bank?.institution_id > 0;
    const isAccValid = accountNo.length > 0;
    const isBranchValid = branchNo.length == 5;

    // Familiy details validations
    const isValidMaritalStatus = maritalStatus?.marital_status_id;

    // Spouse Details validations
    const isSFNameValid = Validator.isValidField(sfName, ST_REGEX.FullName);
    const isSLNameValid = Validator.isValidField(slName, ST_REGEX.FullName);
    const isSGenderValid = sgender;
    const isSDOBValid = sdob;
    const isSResidencyValid = setMailingAddress?.length;
    const isSSinValid = ssinNo.length ? Validator.isValidSIN(ssinNo) : true;
    const isSBankValid = sbank?.institution_id > 0;
    const isSAccValid = saccountNo.length > 0;
    const isSBranchValid = sbranchNo.length == 5;
    const isIdentificationImageAttached = identificationImage?.length;
    console.log(identificationImage)

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter your valid first name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter your valid last name');
    } else if (!isSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid SIN');
    } else if (!isDOBValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select your valid DOB.');
    } else if (!isGenderValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid gender');
    } else if (!isValidMailingAddress) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid mailing address');
    } else if (!isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select a valid bank');
    } else if (!isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account number');
    } else if (!isBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid branch number');
    } else if (!isValidMaritalStatus) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid marital status');
    }else if (!isSFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter spouse valid first name');
    } else if (!isSLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter spouse valid last name');
    } else if (!isSSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid spouse SIN');
    } else if (!isSDOBValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select spouse valid DOB.');
    } else if (!isSGenderValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select spouse valid gender');
    } else if (!isSResidencyValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid mailing address for spouse');
    } else if (isFillingForWife && !isSBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select a valid bank for spouse');
    } else if (isFillingForWife && !isSAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account number for spouse');
    } else if (isFillingForWife && !isSBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid branch number for spouse');
    } else if (!isIdentificationImageAttached) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please attach an identification document');
    }
    return isValidForm;
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
        <AppHeader navigation={navigation}/>
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
              setIsAddViewVisible(true);
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
            onClicked={() => {
              setIsMVisible(true)
            }}
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
              setIsSDatePickerVisible(true);
            }}
          />
          <TouchableInput
            marginTop={15}
            leftAccImage={CustomFonts.Gender}
            rightAccImage={CustomFonts.ChevronDown}
            value={sgender}
            placeholder="Select Gender"
            onClicked={() => {
              setIsSGenderVisible(true);
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
            onClicked={() => {
              setIsSResidenceVisible(true)
            }}
          />
          {isFilingForSpouse && (
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
          )}

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
            title={ statusDetails?.tax_profile_completed ? 'UPDATE' : 'SUBMIT'}
            rightImage={CustomFonts.right_arrow}
            onPress={() => {
              if (checkFormValidations()) {
                setIsLoading(true);
                const params = prepareParamsForSavingProfile();
                const {tax_profile_completed, tax_file_status_id,tax_file_id} = statusDetails;
                if (tax_profile_completed && tax_file_status_id != 16) {
                  const paramsForUpdate = {...params,Tax_File_Id:tax_file_id}
                  onlineUpdateMyprofile(paramsForUpdate, res => {
                    setIsLoading(false);
                    if (res.status == 1) {
                      Alert.alert('Sukhtax', res.message ? res.message : '');
                      pageParams?.onDataFormUpdates(res?.data?.[0])
                      navigation.goBack();
                    } else {
                      Alert.alert('Sukhtax', 'Something went wrong.');
                    }
                  });
                } else {
                  onlineSaveMyprofile(params, res => {
                    setIsLoading(false);
                    if (res.status == 1) {
                      Alert.alert('Sukhtax', res.message ? res.message : '');
                      pageParams?.onDataFormUpdates(res?.data?.[0])
                      navigation.goBack();
                    } else {
                      Alert.alert('Sukhtax', 'Something went wrong.');
                    }
                  });
                }
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
      {isSDatePickerVisible && (
        <SKDatePicker
          originalDate={new Date()}
          maximumDate={new Date()}
          title={'Select date'}
          onCancelPressed={date => {
            setIsSDatePickerVisible(false);
            setSDOB(date);
          }}
          onDonePressed={date => {
            setIsSDatePickerVisible(false);
            setSDOB(date);
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
      {isSGenderVisible && (
        <SKModel
          title="Select"
          data={GENDER_OPTIONS}
          onClose={() => {
            setIsSGenderVisible(false);
          }}
          onSelect={value => {
            setSGender(value);
            setIsSGenderVisible(false);
          }}
        />
      )}
      {isSResidenceVisible && residencies && (
        <SKModel
          title="Select"
          data={residencies}
          keyLabel="residency_name"
          onClose={() => {
            setIsSResidenceVisible(false);
          }}
          onSelect={value => {
            setSResidency(value);
            setIsSResidenceVisible(false);
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
            setSBank(value);
            setIsSSBankVisible(false);
          }}
        />
      )}
      {isMVisible && (
        <SKModel
          title="Select Marital Status"
          data={maritalStatuses}
          keyLabel="marital_status_name"
          onClose={() => {
            setIsMVisible(false);
          }}
          onSelect={value => {
            setMaritalStatus(value);
            setIsMVisible(false);
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
                  Alert.alert('SukhTax', 'Image uploading cancelled by user.');
                } else if (res?.error) {
                } else if (res?.assets) {
                  const imgObj = res?.assets?.[0];
                  if (!imgObj.base64)
                    Alert.alert('SukhTax', 'Something went wrong!');
                  setIdentificationImage(imgObj.base64);
                  setIdentificationImageName(imgObj?.fileName)
                }
              });
            } else if (index == 1) {
              launchCamera(LibImageQualityOptions, res => {
                if (res?.didCancel) {
                  Alert.alert('SukhTax', 'Image uploading cancelled by user.');
                } else if (res?.error) {
                } else if (res?.assets) {
                  const imgObj = res?.assets?.[0];
                  if (!imgObj.base64)
                    Alert.alert('SukhTax', 'Something went wrong!');
                  setIdentificationImage(imgObj.base64);
                  setIdentificationImageName(imgObj?.fileName)
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
                      console.log(fileRes);
                      const imgObj = fileRes?.assets?.[0];
                      if (!imgObj.base64)
                        Alert.alert('SukhTax', 'Something went wrong!');
                      console.log('imgObj.3333', imgObj.base64);
                      setIdentificationImage(imgObj.base64);
                      setIdentificationImageName(imgObj?.fileName)
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

export default OnlineCompleteReviewProfileV3;
