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
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import SKModel from '../components/SKModel';
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {
  getInstitutionList,
  getBankingAndFamilyInfo,
  getResidencyList,
} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
const {width} = Dimensions.get('window');
const BankingAndMore = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  console.log('BankingAndMore pageParams', pageParams);
  const [bank, setBank] = useState('');
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState('7654321');
  const [branchNo, setBranhcNo] = useState('12345');
  const [residency, setResidency] = useState('');
  const [residencies, setResidencies] = useState();
  const [familyInfo, setFamilyInfo] = useState();
  const [enrtyDate, setEntryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBankVisible, setIsBankVisible] = useState(false);
  const [isResidenceVisible, setIsResidenceVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getInstitutionList({}, instRes => {
      console.log('instRes', instRes);
      setBanks(instRes?.data);
      setBank(instRes?.data?.[0])
      const userid = global.userInfo?.user_id;
      const taxFileID = global.userInfo?.Tax_File_Id;
      const params = {
        User_Id: userid,
        Tax_File_Id: taxFileID || 83,
        Year: 2020,
      };
      getBankingAndFamilyInfo(params, bankingAndFamilyRes => {
        console.log('bankingAndFamilyRes', bankingAndFamilyRes);
        setFamilyInfo(bankingAndFamilyRes?.data)
        getResidencyList({}, resdencyRes => {
          console.log('resdencyRes', resdencyRes);
          setResidencies(resdencyRes?.data);
          setResidency(resdencyRes?.data?.[0])
          setIsLoading(false);
        });
      });
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isBankValid = bank?.institution_id > 0
    const isAccValid = accountNo.length > 0
    const isBranchValid = branchNo.length > 0
    const isResidencyValid = residency?.residency_id > 0
    const isEnrtyDateValid = enrtyDate ? true : false

    if (!isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid Institution.');
    } else if (!isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account number.');
    } else if (!isBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid branch code.');
    }
    else if (!isResidencyValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid residency type.');
    }
    else if (!isEnrtyDateValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid date of immigration.');
    }
    return isValidForm;
  };

  const prepareParams = () =>{
    const params = {bank:bank, accountNo:accountNo, branchNo:branchNo, residency:residency,enrtyDate:enrtyDate, province:pageParams.province}
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
          marginBottom: 30,
        }}>
        <Heading value="BANKING AND MORE" marginTop={26} />
        <Heading
          fontSize={20}
          marginTop={45}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="PLEASE ENTER YOUR DIRECT DIPOSIT INFORMATION"
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
          onEndEditing={value => {}}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={branchNo}
          placeholder="#Enter Branch Number"
          onEndEditing={value => {}}
        />
        <Heading fontSize={20} marginTop={45} value="WHAT IS YOUR RESIDENCY:" />
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
        <Heading
          fontSize={20}
          marginTop={45}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="DATE OF ENTRY INTO CANADA(IF IMMIGRATED)"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Calender}
          value={enrtyDate && format(enrtyDate, 'dd/MM/yyyy')}
          placeholder="Date of Immigration (DD/MM/YYYY)"
          onClicked={() => {
            setIsDatePickerVisible(true);
          }}
        />
        <SKButton
          marginTop={20}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'FAMILY'}
          onPress={() => {
            console.log('link pressed');
            if(checkFormValidations()){
              const nextPageParams = prepareParams()
              navigation.navigate('FamilyDetails',{...nextPageParams});
            }
          }}
        />
      </ScrollView>
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
            display={Platform.OS == 'ios' ? "inline" : 'default'}
            onChange={(event, selectedDate) => {
              console.log(event.type, Date.parse(selectedDate));
              setEntryDate(selectedDate);
              console.log('====>', format(selectedDate, 'dd/MM/yyyy'));
              setIsDatePickerVisible(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default BankingAndMore;
