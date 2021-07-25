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
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {getMaritalStatusList,saveBankingAndFamilyInfoByYear} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
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
  console.log('FamilyDetails pageParams', pageParams);
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

  useEffect(() => {
    getMaritalStatusList({}, maritalRes => {
      console.log('maritalRes', maritalRes);
      setMaritalStatuses(maritalRes?.data);
      setMaritalStatus(maritalRes?.data?.[0])
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
    const {user_id,tax_file_id = 83,Tax_File_Id, tax_file_year_id} = global.userInfo
    const params = {
      User_id:user_id,
      Tax_File_Id:tax_file_id || Tax_File_Id,
      Tax_File_Year_Id:tax_file_year_id,
      Year:2020,
      Province_Lived_In:province?.state_name,
      Institution_Id:bank?.institution_id,
      Branch:branchNo,
      Account_No:accountNo,
      Residency:residency?.residency_name,
      Immigration_Date:enrtyDate && format(enrtyDate, 'yyyy-MM-dd'),
      Marital_Status_Id:maritalStatus?.marital_status_id,
      Marital_Status_Change:mChangeOpton.id,
      Marital_Status_Change_Date:mStatusChangedDate && format(mStatusChangedDate, 'yyyy-MM-dd'),
      Dependents:0,
      Spouse_Residency:0,
    }
    return params
  }

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
          color={Colors.CLR_D9272A}
          value="MARITAL STATUS ON DECEMBER 31, 2018"
        />
        <TouchableInput
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select Marital Status"
          value={maritalStatus?.marital_status_name}
          onClicked={() => {
            console.log('sdsd');
            setIsMVisible(true);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={45}
          color={Colors.CLR_D9272A}
          value="DID YOUR MARITAL STATUS CHANGED IN 2018?"
        />
        <TouchableInput
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select"
          value={mChangeOpton?.value}
          onClicked={() => {
            console.log('sdsd');
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
          color={Colors.CLR_D9272A}
          value="ANY DEPENDENTS IN 2018?"
        />
        <TouchableInput
          rightAccImage={CustomFonts.ChevronDown}
          placeholder="Select"
          value={dependentOption?.value}
          onClicked={() => {
            console.log('sdsd');
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
          title={'NEXT'}
          onPress={() => {
            if(checkFormValidations()){
              setIsLoading(true)
              const params = prepareParams()
              saveBankingAndFamilyInfoByYear(params, (saveBankingRes) =>{
                setIsLoading(false)
                if(saveBankingRes?.status == 1){
                  console.log('saveBankingRes', maritalStatus,dependents)
                  if(maritalStatus?.marital_status_id == 2 || maritalStatus?.marital_status_id == 3){
                    navigation.navigate('Spouse');
                  }else if (dependents.count > 0){
                    navigation.navigate('Dependents');
                  }else {
                    navigation.navigate('MyTaxYear');
                  }
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
            console.log('value', value);
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
            console.log('value', value);
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
            console.log('value', value);
            setDependentOption(value);
            setIsDepOptionVisible(false);
          }}
        />
      )}
      {showDatePicker && (
        <View
          style={{
            backgroundColor: '#FFE6E6',
            position: 'absolute',
            bottom: 0,
            height: pickerHeight,
            width: width,
          }}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              console.log(event.type, Date.parse(selectedDate));
              setMStatusChangedDate(selectedDate);
              console.log('====>', format(selectedDate, 'dd/MM/yyyy'));
              setShowDatePicker(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default FamilyDetails;
