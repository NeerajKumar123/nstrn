import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import {YES_NO} from '../constants/StaticValues';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import AppHeader from '../components/AppHeader';
import SKDatePicker from '../components/SKDatePicker';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {getMaritalStatusList,updateBankingAndFamilyInfoByYear} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';

const {width} = Dimensions.get('window');

const FamilyDetails = props => {
  const iosVersion = parseInt(Platform.Version);
  let pickerHeight = 0;
  if (Platform.OS == 'ios') {
    pickerHeight = iosVersion >= 14 ? 400 : 216;
  }
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const dependents = []
  const [maritalStatus, setMaritalStatus] = useState();
  const [maritalStatuses, setMaritalStatuses] = useState();
  const [mChangeOpton, setMChangeOpton] = useState(YES_NO[1]);
  const [mStatusChangedDate, setMStatusChangedDate] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dependentOption, setDependentOption] = useState(YES_NO[1]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMVisible, setIsMVisible] = useState();
  const [isMChangeVisible, setIsMChangeVisible] = useState();
  const [isDepOptionVisible, setIsDepOptionVisible] = useState();
  const [nextButtonTitle, setNextButtonTitle] = useState('MY TAX YEAR')
  let maxDate = new Date(); 
  maxDate.setFullYear(global?.mostRecentYear);
  
  useEffect(() => {
    setIsLoading(true)
    getMaritalStatusList({}, maritalRes => {
      setMaritalStatuses(maritalRes?.data);
      setMaritalStatus(maritalRes?.data?.[0])
      setIsLoading(false)
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isValidMaritalStatus = maritalStatus
    const isMChangeDateValid = mChangeOpton.id == 1 ?  mStatusChangedDate : true
    if (!isValidMaritalStatus) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please choose valid marital status.');
    } else if (!isMChangeDateValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter marital status change date.');
    }
    return isValidForm;
  };

  const prepareParams = () =>{
    const {accountNo,bank,branchNo,enrtyDate,residency, province} = pageParams
    const {user_id,Year_Wise_Records,tax_file_id,tax_file_year_id} = global.onlineStatusData
    const record =Year_Wise_Records && Year_Wise_Records.length > 0 ? Year_Wise_Records?.[0] :{}
    const params = {
      User_id:user_id,
      Tax_File_Id:tax_file_id,
      Tax_File_Year_Id:tax_file_year_id,
      Year:global?.mostRecentYear,
      Province_Lived_In:province?.state_name,
      Institution_Id:bank?.institution_id,
      Branch:branchNo,
      Account_No:accountNo,
      Residency:residency?.residency_name,
      Immigration_Date:enrtyDate && format(enrtyDate, 'yyyy-MM-dd'),
      Marital_Status_Id:maritalStatus?.marital_status_id,
      Marital_Status_Change:mChangeOpton?.id,
      Marital_Status_Change_Date:mStatusChangedDate && format(mStatusChangedDate, 'yyyy-MM-dd'),
      Dependents:dependentOption?.id,
      Spouse_Residency:0,
    }
    return params
  }

  useEffect(() => {
    if(maritalStatus?.marital_status_id == 2 || maritalStatus?.marital_status_id == 3){
      setNextButtonTitle('SPOUSE')
    }else if(dependentOption?.id == 1){
      setNextButtonTitle('DEPENDENTS')
    }else{
      setNextButtonTitle('MY TAX YEAR')
    }
  }, [maritalStatus,dependentOption])

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
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading value="WHO IS IN YOUR FAMILY" marginTop={26} />
        <Heading
          fontSize={20}
          marginTop={45}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`MARITAL STATUS ON DECEMBER 31, ${global.mostRecentYear}`}
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
          marginTop={45}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`DID YOUR MARITAL STATUS CHANGE IN ${global.mostRecentYear}?`}
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
          marginTop={45}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`ANY DEPENDENTS IN ${global.mostRecentYear}?`}
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
          title={nextButtonTitle}
          onPress={() => {
            if(checkFormValidations()){
              setIsLoading(true)
              const params = prepareParams()
              updateBankingAndFamilyInfoByYear(params, (saveBankingRes) =>{
                setIsLoading(false)
                if(saveBankingRes?.status == 1){
                  const check = (maritalStatus?.marital_status_id == 2 || maritalStatus?.marital_status_id == 3) ? true : false
                  SKTStorage.setKeyValue('isFromSpouseFlow',check,()=>{
                    if(maritalStatus?.marital_status_id == 2 || maritalStatus?.marital_status_id == 3){
                      navigation.navigate('Spouse',{dependentOption:dependentOption.id});
                    }else if (dependentOption.id  == 1){
                      navigation.push('DependentsList', {depCount:1});
                    }else {
                      navigation.navigate('MyTaxYear',{pageIndex:0});
                    }
                  })
                }else{
                  Alert.alert('SukhTax','Something went wrong.')
                  return
                }
              })
            }
          }}
        />
      </ScrollView>
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
          }}
        />
      )}
      {showDatePicker && (
        <SKDatePicker
        originalDate = {new Date()}
        maximumDate = {maxDate}
        title = {'Select date'}
        onCancelPressed = {(date)=>{
          setShowDatePicker(false)
          setMStatusChangedDate(date);
        }}
        onDonePressed = {(date)=>{
          setMStatusChangedDate(date);
          setShowDatePicker(false)
        }}
        />
      )}
    </View>
  );
};

export default FamilyDetails;
