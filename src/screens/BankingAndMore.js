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
  Text,
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import SKModel from '../components/SKModel';
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import SKDatePicker from '../components/SKDatePicker';
import * as Validator from '../helpers/SKTValidator';
import {LocalInstsList, LocalResidencyList} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {
  getInstitutionList,
  getBankingAndFamilyInfo,
  getResidencyList,
  onlineGetBankingInfoByUser,
} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import {useIsFocused} from '@react-navigation/native';
const BankingAndMore = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const pageParams = props.route.params;
  const isEditing = pageParams?.isEditing
  const [bank, setBank] = useState('');
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState('');
  const [branchNo, setBranhcNo] = useState('');
  const [residency, setResidency] = useState('');
  const [residencies, setResidencies] = useState([]);
  const [enrtyDate, setEntryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBankVisible, setIsBankVisible] = useState(false);
  const [isResidenceVisible, setIsResidenceVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isBankingInfoChanged, setIsBankingInfoChanged] = useState(false);
  const {Tax_Filed_With_Sukhtax} = global.onlineStatusData;

  // params for next page....
  const [maritalStatus, setMaritalStatus] = useState();
  const [mChangeOpton, setMChangeOpton] = useState({id: 1, value: 'Yes'});
  const [mStatusChangedDate, setMStatusChangedDate] = useState();
  const [dependentOption, setDependentOption] = useState({id: 1, value: 'Yes'});


  useEffect(() => {
    setIsLoading(true);
    getInstitutionList({}, instRes => {
      setBanks(instRes?.data);
      setBank(instRes?.data?.[0]);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });

    getResidencyList({}, resdencyRes => {
      if (resdencyRes.status == 1) {
        setResidencies(resdencyRes?.data);
      }else{
        setResidencies(LocalResidencyList);
      }
    });
  }, []);

  useEffect(() => {
    if (isFocused && isEditing) {
      const {tax_file_id, user_id} =  global.onlineStatusData;
      const params = {
        User_Id: user_id,
        Tax_File_Id: tax_file_id,
        Year: global?.mostRecentYear,
      };
      getBankingAndFamilyInfo(params, bankingAndFamilyRes => {
        const details = bankingAndFamilyRes.data[0];
        if (details) {
          setBank({
            institution_name: details.institution_name,
            institution_id: details.institution_id,
          });
          setAccountNo(details.account_no);
          setResidency({residency_id: details.residency_id , residency_name :details.residency});
          setBranhcNo(details.branch);
          setEntryDate(new Date(details.immigration_date));
          setMaritalStatus({marital_status_id:details.marital_status_id,marital_status_name:details.marital_status_name})
          setMChangeOpton({id:details.marital_status_change,value:details.marital_status_change ? 'YES' : 'NO'})
          setMStatusChangedDate(details.marital_status_change ? new Date(details.marital_status_change_date) : new Date())
          setDependentOption({id:details.dependents,value:details.dependents ? 'YES' : 'NO'})
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
    }
  }, [isFocused])

  const checkFormValidations = () => {
    let isValidForm = true;
    const isBankValid = bank?.institution_id > 0;
    const isAccValid = accountNo.length > 0;
    const isBranchValid = branchNo.length == 5;
    const isResidencyValid = residency?.residency_id > 0;
    const isEnrtyDateValid = enrtyDate ? true : false;

    if (!isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid Institution.');
    } else if (!isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid account number.');
    } else if (!isBranchValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid branch code.');
    } else if (!isResidencyValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid residency type.');
    } else if (false && !isEnrtyDateValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select valid date of immigration.');
    }
    return isValidForm;
  };

  const prepareParams = () => {
    const params = {
      bank: bank,
      accountNo: accountNo,
      branchNo: branchNo,
      residency: residency,
      enrtyDate: enrtyDate,
      province: global?.province,
      maritalStatus:maritalStatus,
      mChangeOpton:mChangeOpton,
      mStatusChangedDate:mStatusChangedDate,
      dependentOption:dependentOption,
      isEditing:isEditing
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
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="BANKING AND MORE" marginTop={26} />
        {Tax_Filed_With_Sukhtax && !isEditing && !isBankingInfoChanged ? (
          <>
            <Heading
              fontSize={20}
              marginTop={30}
              color={Colors.RED}
              value="HAS YOUR BANKING INFO CHANGED SINCE LAST YEAR?"
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
                  onlineGetBankingInfoByUser(
                    {User_Id: user_id},
                    byUserInfoRes => {
                      setIsBankingInfoChanged(true);
                      if (byUserInfoRes.status == 1) {
                        const details = byUserInfoRes.data[0];
                        if (details) {
                          setBank({
                            institution_name: details.institution_name,
                            institution_id: details.institution_id,
                          });
                          setAccountNo(details.account_no);
                          const filtered = residencies?.filter(element => {
                            return element.residency_name == details.residency;
                          });
                          setResidency(filtered[0]);
                          setBranhcNo(details.branch);
                          setEntryDate(new Date(details.immigration_date));
                        }
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 300);
                      }
                    },
                  );
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
                  setIsBankingInfoChanged(true);
                }}
              />
            </View>
          </>
        ) : (
          <>
            <Heading
              fontSize={20}
              marginTop={45}
              color={Colors.APP_RED_SUBHEADING_COLOR}
              value="PLEASE ENTER YOUR DIRECT DEPOSIT INFORMATION"
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
              marginTop={10}
              maxLength={30}
              leftAccImage={CustomFonts.Number}
              borderColor={Colors.CLR_0065FF}
              value={accountNo}
              keyboardType="number-pad"
              placeholder="Enter Account Number"
              onEndEditing={value => {
                setAccountNo(value);
              }}
            />
            <SKInput
              marginTop={10}
              marginBottom={0}
              leftAccImage={CustomFonts.Number}
              maxLength={30}
              borderColor={Colors.CLR_0065FF}
              value={branchNo}
              keyboardType="number-pad"
              placeholder="Enter Branch Number"
              onEndEditing={value => {
                setBranhcNo(value);
              }}
            />
            <Heading
              fontSize={20}
              marginTop={45}
              value="WHAT IS YOUR RESIDENCY:"
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
            <Heading
              fontSize={20}
              marginTop={45}
              color={Colors.APP_RED_SUBHEADING_COLOR}
              value="DATE OF ENTRY INTO CANADA (IF IMMIGRATED)"
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
                if (checkFormValidations()) {
                  const nextPageParams = prepareParams();
                  navigation.navigate('FamilyDetails', {...nextPageParams});
                }
              }}
            />
          </>
        )}
      </ScrollView>
      {isBankVisible && banks  &&  (
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
      {isDatePickerVisible && (
        <SKDatePicker
          originalDate={new Date()}
          maximumDate={new Date()}
          title={'Select date'}
          onCancelPressed={date => {
            setIsDatePickerVisible(false);
            setEntryDate(date);
          }}
          onDonePressed={date => {
            setEntryDate(date);
            setIsDatePickerVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default BankingAndMore;
