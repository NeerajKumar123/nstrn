import React, {useState, useEffect, useRef} from 'react';
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
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import {
  getCanadaProvinceList,
  saveAboutInfo,
  getResidencyList,
  getMaritalStatusList,
} from '../apihelper/Api';
import SKModel from '../components/SKModel';
import SKGGLAddressModel from '../components/SKGGLAddressModel';
import SKDatePicker from '../components/SKDatePicker';
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';
import {YES_NO} from '../constants/StaticValues';

const AddressInsideTaxYear = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [mailingAddress, setMailingAddress] = useState();
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isProvinceVisible, setIsProvinceVisible] = useState(false);
  const [isAddViewVisible, setIsAddViewVisible] = useState(false);
  const [isResidenceVisible, setIsResidenceVisible] = useState(false);
  const [residency, setResidency] = useState('');
  const [residencies, setResidencies] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState();
  const [maritalStatuses, setMaritalStatuses] = useState();
  const [mChangeOpton, setMChangeOpton] = useState(YES_NO[1]);
  const [mStatusChangedDate, setMStatusChangedDate] = useState();
  const [isMVisible, setIsMVisible] = useState();
  const [isMChangeVisible, setIsMChangeVisible] = useState();
  const [isDepOptionVisible, setIsDepOptionVisible] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dependentOption, setDependentOption] = useState(YES_NO[1]);
  let maxDate = new Date();
  maxDate.setFullYear(global?.mostRecentYear);

  useEffect(() => {
    setIsLoading(true);
    const params = {};
    getCanadaProvinceList(params, provinceRes => {
      setIsLoading(false);
      setProvinces(provinceRes?.data);
      getResidencyList({}, resdencyRes => {
        setResidencies(resdencyRes?.data);
        setResidency(resdencyRes?.data?.[0]);
        setIsLoading(false);
      });
      getMaritalStatusList({}, maritalRes => {
        setMaritalStatuses(maritalRes?.data);
        setMaritalStatus(maritalRes?.data?.[0]);
        setIsLoading(false);
      });
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isMailingAddValid = mailingAddress?.length > 0;
    const isProvinceValid = province?.state_id;
    if (!isMailingAddValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Mailing address');
    } else if (!isProvinceValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid province');
    }
    return isValidForm;
  };

  const prepareParams = () => {
    const {user_id} = global.onlineStatusData;
    const commaSepYrs = global.selectedYears && global.selectedYears.join();
    const dob = pageParams.dob && format(pageParams.dob, 'yyyy-MM-dd');
    const params = {
      User_Id: user_id,
      SIN_Number: pageParams.sin,
      Gender: pageParams.gender,
      DOB: dob,
      Last_Year_Tax_Filed: pageParams.lastTime,
      Mailing_Address: mailingAddress,
      Year: global?.mostRecentYear,
      Module_Type_Id: 2,
      Years_Selected: commaSepYrs,
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
      {isLoading && <SKLoader />}
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading value={`${pageParams?.year}`} marginTop={26} />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`WHICH PROVINCE DID YOU LIVE IN ON DECEMBER 31, ${pageParams.year}?`}
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
        <Heading fontSize={20} marginTop={20} value="WHAT IS YOUR RESIDENCY:" />
        <TouchableInput
          leftAccImage={CustomFonts.Home}
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Residency"
          value={residency?.residency_name}
          onClicked={() => {
            setIsResidenceVisible(true);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={20}
          value="WHAT IS YOUR SPOUSE RESIDENCY:"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Home}
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Spouse Residency"
          value={residency?.residency_name}
          onClicked={() => {
            setIsResidenceVisible(true);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`MARITAL STATUS ON DECEMBER 31, ${pageParams?.year}`}
        />
        <TouchableInput
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Marital Status"
          value={maritalStatus?.marital_status_name}
          onClicked={() => {
            setIsMVisible(true);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`DID YOUR MARITAL STATUS CHANGE IN ${pageParams?.year}?`}
        />
        <TouchableInput
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select"
          value={mChangeOpton?.value}
          onClicked={() => {
            setIsMChangeVisible(true);
          }}
        />
        {mChangeOpton && mChangeOpton.id == 1 && (
          <TouchableInput
            leftAccImage={CustomFonts.Calender}
            value={
              mStatusChangedDate && format(mStatusChangedDate, 'dd/MM/yyyy')
            }
            placeholder="Marital Status Change Date (DD/MM/YYYY)"
            onClicked={() => {
              setShowDatePicker(true);
            }}
          />
        )}
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`ANY DEPENDENTS IN ${pageParams?.year}?`}
        />
        <TouchableInput
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select"
          value={dependentOption?.value}
          onClicked={() => {
            setIsDepOptionVisible(true);
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BANKING'}
          onPress={() => {
            if (checkFormValidations()) {
              setIsLoading(true);
              const params = prepareParams();
              saveAboutInfo(params, saveRes => {
                setIsLoading(false);
                if (saveRes?.status == -1) {
                  Alert.alert('SukhTax', 'Something went wrong');
                  return;
                }
                global.onlineStatusData = {
                  ...global.onlineStatusData,
                  ...saveRes?.data[0],
                };
                SKTStorage.setKeyValue('province', province, () => {
                  navigation.navigate('BankingAndMore', {province: province});
                });
              });
            }
          }}
        />
        </ScrollView>
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
        {isMVisible && (
          <SKModel
            title="Select Gender"
            data={maritalStatuses}
            keyLabel="marital_status_name"
            onClose={() => {
              setIsMVisible(false);
            }}
            onSelect={value => {
              setMaritalStatus(value);
              setIsMVisible(false);
              if (
                value.marital_status_id == 2 ||
                value.marital_status_id == 3
              ) {
                //   setNextButtonTitle('SPOUSE')
              } else if (dependentOption.id == 1) {
                //   setNextButtonTitle('DEPENDENTS')
              } else {
                //   setNextButtonTitle('MY TAX YEAR')
              }
            }}
          />
        )}
        {isMChangeVisible && (
          <SKModel
            title="Select"
            data={YES_NO}
            keyLabel="value"
            onClose={() => {
              setIsMChangeVisible(false);
            }}
            onSelect={value => {
              setMChangeOpton(value);
              setIsMChangeVisible(false);
            }}
          />
        )}
        {isDepOptionVisible && (
          <SKModel
            title="Select"
            data={YES_NO}
            keyLabel="value"
            onClose={() => {
              setIsDepOptionVisible(false);
            }}
            onSelect={value => {
              setDependentOption(value);
              setIsDepOptionVisible(false);
              if (
                value.marital_status_id == 2 ||
                value.marital_status_id == 3
              ) {
                //   setNextButtonTitle('SPOUSE')
              } else if (value.id == 1) {
                //   setNextButtonTitle('DEPENDENTS')
              } else {
                //   setNextButtonTitle('MY TAX YEAR')
              }
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
        {showDatePicker && (
          <SKDatePicker
            originalDate={new Date()}
            maximumDate={maxDate}
            title={'Select date'}
            onCancelPressed={date => {
              setShowDatePicker(false);
              setMStatusChangedDate(date);
            }}
            onDonePressed={date => {
              setMStatusChangedDate(date);
              setShowDatePicker(false);
            }}
          />
        )}
    </View>
  );
};

export default AddressInsideTaxYear;
