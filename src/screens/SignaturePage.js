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
  Text,
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
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

const SignaturePage = props => {
  const navigation = useNavigation();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [sinNo, setSinNo] = useState('');
  const [relation, setRelation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.LName);
    const isDOBValid = Validator.isValidField(dob, ST_REGEX.FName);
    const isGenderValid = Validator.isValidField(gender, ST_REGEX.FName);
    const isSinValid = Validator.isValidField(sinNo, ST_REGEX.FName);
    const isRelationValid = Validator.isValidField(relation, ST_REGEX.FName);

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Mailing address');
    } else if (!isLNameValid) {
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
          marginBottom: 100,
        }}>
        <Heading
          fontSize={20}
          value="AUTHORIZE A REPRESENTATIVE-SIGNATURE PAGE"
          marginTop={26}
        />
        <Heading
          fontSize={16}
          marginTop={45}
          color={Colors.CLR_D9272A}
          value="TAX PAYER INFORMATION"
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={fName}
          placeholder="#Enter SIN Number"
          onEndEditing={value => {}}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Enter First Name"
          onEndEditing={value => {}}
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Enter Last Name"
          onEndEditing={value => {}}
        />
        <SKCheckbox />
        <Heading
          fontSize={12}
          marginTop={10}
          color={Colors.CLR_D9272A}
          value="BY SIGNING AND DATING THIS PAGE, YOU AUTHORIZE THE CANADA REVENUE AGENCY TO INTRACT WITH SUKH TAX AND FINANCIAL SERVICES, WITH REF ID H6YX7GS,GROUP ID:G, UNDER LEVEL 2 OF AUTHORIZATION, WHERE SUKHTAX AND FINANCIAL SERVICES HAS THE ABILITY TO DISCLOSE AND REQUEST. I AGREE TO NO EXPIRY DATE ON THIS AUTHORIZARION, AND UNDERSTAND THAT I CAN CONTACT THE CANADA REVENUE AGENCY DIRECTLY AT A LATER TIME TO RECIND THIS AUTHORIZARION"
        />
        <Heading
          fontSize={13}
          value="SIGNATURE OF TAXPAYER OR LEGAL REPRESENTATIVE"
          marginTop={26}
        />
        <SignatureBlock/>

      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 30,
        }}>
        <SKButton
          fontSize={16}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            navigation.goBack();
          }}
        />
       
      </View>
    </View>
  );
};

const SKCheckbox = props => {
  //checkbox-blank-outline
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
      }}
      onToggle={() => {
        props.onToggle && props.onToggle();
      }}>
      <Icon name={'check-box-outline'} size={30} color={Colors.GRAY} />
      <Text style={{color: Colors.CLR_29295F, marginLeft: 10, flex: 1}}>
        I authorize SukhTax and Financial Services as per below.
      </Text>
    </TouchableOpacity>
  );
};

const SignatureBlock = props => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginTop: 20,
          height:200,
          borderColor:Colors.LIGHTGRAY,
          borderRadius:6,
           borderWidth:.5
        }}
        >
        <Text style={{color: Colors.CLR_29295F, marginLeft: 10, flex: 1}}>
          This is SignatureBlock
        </Text>
      </View>
    );
  };

export default SignaturePage;
