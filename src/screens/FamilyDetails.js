import React, {useState} from 'react';
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
import SKDropdown from '../components/SKDropdown';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {register} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const FamilyDetails = props => {
  const navigation = useNavigation();
  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [branchNo, setBranhcNo] = useState('')
  const [residency, setResidency] = useState('')
  const [enrtyDate, setEntryDate] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isBankValid = Validator.isValidField(bank,ST_REGEX.FName);
    const isAccValid = Validator.isValidField(accountNo,ST_REGEX.FName);
    const isBranchValid = Validator.isValidField(branchNo,ST_REGEX.FName);
    const isResidencyValid = Validator.isValidField(residency,ST_REGEX.FName);
    const isEnrtyDateValid = Validator.isValidField(enrtyDate,ST_REGEX.FName);

    if (!isBankValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Mailing address');
    } else if (!isAccValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid province');
    }
    return isValidForm;
  };
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
      <AppHeader navigation = {navigation}/>
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
           <SKDropdown
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={bank}
            placeholder="Select Marital Status"
            onEndEditing={value => {
            }}
          />
          <Heading
            fontSize={20}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="DID YOUR MARITAL STATUS CHANGED IN 2018?"
          />
          <SKDropdown
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={residency}
            placeholder="Select"
            onEndEditing={value => {
            }}
          />
           <Heading
            fontSize={20}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="ANY DEPENDENTS IN 2018?"
          />
          <SKDropdown
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={residency}
            placeholder="Select"
            onEndEditing={value => {
            }}
          />
          <SKButton
          marginTop ={30}
          fontSize={16}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'DEPENDENTS'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('Dependents');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default FamilyDetails;
