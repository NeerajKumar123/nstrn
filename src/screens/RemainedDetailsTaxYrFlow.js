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
import {LocalInstsList, LocalResidencyList, LocalResidencyListSpouse} from '../constants/StaticValues';
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
  saveBankingAndFamilyInfoByYear,
  getResidencyList,
  getSpouseResidencyList,
  getMaritalStatusList,
} from '../apihelper/Api';
import SKModel from '../components/SKModel';
import SKGGLAddressModel from '../components/SKGGLAddressModel';
import SKDatePicker from '../components/SKDatePicker';
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';
import {YES_NO} from '../constants/StaticValues';

const RemainedDetailsTaxYrFlow = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const isEditing = pageParams?.isEditing
  const [mailingAddress, setMailingAddress] = useState();
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isProvinceVisible, setIsProvinceVisible] = useState(false);
  const [isAddViewVisible, setIsAddViewVisible] = useState(false);
  const [isResidenceVisible, setIsResidenceVisible] = useState(false);
  const [isSpouseResidenceVisible, setIsSpouseResidenceVisible] = useState(false);
  const [residency, setResidency] = useState('');
  const [spouseResidency, setSpouseResidency] = useState('');
  const [residencies, setResidencies] = useState();
  const [residenciesSpouse, setResidenciesSpouse] = useState();
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
  maxDate.setFullYear(pageParams?.year);

  useEffect(() => {
    setIsLoading(true);
    const params = {};
    getCanadaProvinceList(params, provinceRes => {
      console.log('setProvinces',provinceRes)
      setProvinces(provinceRes?.data);
      getResidencyList({}, resdencyRes => {
        if (resdencyRes.status == 1) {
          setResidencies(resdencyRes?.data);
          setResidency(resdencyRes?.data?.[0]);  
        }else{
          setResidencies(LocalResidencyList);
          setResidency(LocalResidencyList[0]);  
        }
      });
      getSpouseResidencyList({}, resdencyResSpouse => {
        if (resdencyResSpouse.status == 1) {
          setResidenciesSpouse(resdencyResSpouse?.data);
          setSpouseResidency(resdencyResSpouse?.data?.[0]);  
        }else{
          setResidenciesSpouse(LocalResidencyListSpouse);
          setSpouseResidency(LocalResidencyListSpouse[0]);  
        }
      });
      getMaritalStatusList({}, maritalRes => {
        setMaritalStatuses(maritalRes?.data);
        setMaritalStatus(maritalRes?.data?.[0]);
      });

      setTimeout(() => {
        setIsLoading(false)
      }, 1500);
    });
  }, []);


  const checkFormValidations = () => {
    let isValidForm = true;
    const isProvinceValid = province?.state_id;
     if (!isProvinceValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid province');
    }
    return isValidForm;
  };
  const prepareParams = () =>{
    const {user_id,tax_file_id} = global.onlineStatusData
    const params = {
      User_id:user_id,
      Tax_File_Id:tax_file_id,
      Year:pageParams?.year,
      Province_Lived_In:province?.state_name,
      Residency:residency?.residency_name,
      Spouse_Residency:spouseResidency?.residency_name,
      Marital_Status_Id:maritalStatus?.marital_status_id,
      Marital_Status_Change:mChangeOpton?.id,
      Marital_Status_Change_Date:(mChangeOpton?.id == 1 && mStatusChangedDate) ? format(mStatusChangedDate, 'yyyy-MM-dd') : '',
      Dependents:dependentOption?.id,
      Tax_File_Year_Id:0,
      Immigration_Date:'',
      Institution_Id:0,
      Branch:'',
      Account_No:'',
    }
    return params
  }


  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        backgroundColor:'white'
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
          value={`WHICH PROVINCE DID YOU LIVE IN ON DECEMBER 31, ${pageParams?.year}?`}
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
          value={spouseResidency?.residency_name}
          onClicked={() => {
            setIsSpouseResidenceVisible(true);
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
          title={`${pageParams?.year} MY TAX YEAR`}
          onPress={() => {
            if (checkFormValidations()) {
              setIsLoading(true);
              const params = prepareParams()
              saveBankingAndFamilyInfoByYear(params, (saveBankingRes) =>{
                setIsLoading(false);
                if (saveBankingRes?.status == 1) {
                  const isSpouceFlow = maritalStatus.id == 2 || maritalStatus.id == 3
                  SKTStorage.setKeyValue('isFromSpouseFlow',isSpouceFlow, ()=>{
                    global.onlineStatusData = {
                      ...global.onlineStatusData,
                      ...saveBankingRes?.data[0],
                    };
                    navigation.push('MyTaxYear',{pageIndex:pageParams?.pageTaxYrIndex});
                  })
                }else{
                  Alert.alert('SukhTax', saveBankingRes.message || 'Something went wrong');
                }
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
        {isSpouseResidenceVisible && (
          <SKModel
            title="Select"
            data={residenciesSpouse}
            keyLabel="residency_name"
            onClose={() => {
              setIsSpouseResidenceVisible(false);
            }}
            onSelect={value => {
              setSpouseResidency(value);
              setIsSpouseResidenceVisible(false);
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
              console.log('mChangeOpton?.id',value)
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

export default RemainedDetailsTaxYrFlow;
