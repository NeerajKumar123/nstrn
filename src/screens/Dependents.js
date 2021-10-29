import React, { useState, useEffect } from 'react';
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
  FlatList
} from 'react-native';
import TouchableInput from '../components/TouchableInput';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
import { useNavigation } from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import AppHeader from '../components/AppHeader';
import SKDatePicker from '../components/SKDatePicker';
import { GENDER_OPTIONS, RELATIONS } from '../constants/StaticValues';
import * as Validator from '../helpers/SKTValidator';
import { ST_REGEX } from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import { onlineSaveDependentInfo, onlineUpdateDependentInfo, onlineGetDependentInfoByUserId } from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const { width } = Dimensions.get('window');
import { format } from 'date-fns'

const Dependents = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [sinNo, setSinNo] = useState('');
  const [relation, setRelation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState()
  const [isDatePickerVisible, setIsDatePickerVisible] = useState()
  const [isRelationVisible, setIsRelationVisible] = useState()
  const [dependents, setDependents] = useState(pageParams?.alreadyAddedDependents || [])
  const [isDependentFetched, setIsDependentFetched] = useState(pageParams?.isFetched)
  const {Tax_Filed_With_Sukhtax,user_id} = global.onlineStatusData;


  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName,ST_REGEX.FullName)
    const isLNameValid = Validator.isValidField(lName,ST_REGEX.FullName)
    const isDOBValid = dob
    const isGenderValid = gender
    const isSinValid = Validator.isValidSIN(sinNo)
    const isRelationValid = relation
    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid First Name.');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter Last Name.');
    } else if (!isDOBValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter DOB.');
    } else if (!isGenderValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select gender.');
    } else if (!isSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter SIN');
    } else if (!isRelationValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select gender');
    }
    return isValidForm;
  };

  const prepareParamsForSave = () => {
    const { user_id, tax_file_id } = global.onlineStatusData
    const params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id,
      DOB: dob && format(dob, 'yyyy-MM-dd'),
      Gender: gender,
      SIN_Number: sinNo,
      Relationship: relation,
      First_Name: fName,
      Last_Name: lName,
      isLocallyAdded:true
    }
    return params
  }

  const prepareParams= (obj) => {
    console.log('obj',obj)
    const { user_id, tax_file_id } = global.onlineStatusData
   let params = {}
   params.User_id = user_id
   params.Tax_File_Id = tax_file_id
   params.DOB = obj.DOB
   params.SIN_Number = obj.SIN_Number

   if (obj.isLocallyAdded) {
    params.Relationship = obj.Relationship
    params.First_Name = obj.First_Name
    params.Last_Name = obj.Last_Name
    params.Gender = obj.Gender
   }else{
    params.Relationship = obj.Relationship
    params.First_Name = obj.first_name
    params.Last_Name = obj.last_name
    params.Gender = obj.gender
   }
    return params
  }

  useEffect(() => {
    if (Tax_Filed_With_Sukhtax && !isDependentFetched) {
      onlineGetDependentInfoByUserId({ User_Id: user_id }, lastdepRes => {
        if (lastdepRes.status == 1) {
          const deps = [...dependents,...lastdepRes.data]
          setDependents(deps)
          setIsDependentFetched(true)
        }
      })
    }
    
  }, [])
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
        <Heading
          value="THIS IS SOMEONE WHO RELIES ON YOU FOR FINANCIAL SUPPORT"
          marginTop={20}
          fontSize={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
        />
        {Tax_Filed_With_Sukhtax == 1 && dependents.length > 0 && <AddedDependentView data={dependents} />}
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`DEPENDENT ${dependents?.length + 1}`}
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={fName}
          placeholder="Enter First Name"
          onEndEditing={value => {
            setFName(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.UserIcon}
          marginTop={20}
          marginBottom={0}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={lName}
          placeholder="Enter Last Name"
          onEndEditing={value => {
            setLName(value)
          }}
        />
        <SKInput
          leftAccImage={CustomFonts.Number}
          marginTop={20}
          marginBottom={10}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={sinNo}
          placeholder="Enter SIN"
          keyboardType='number-pad'
          onEndEditing={value => {
            setSinNo(value)
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Calender}
          value={dob && format(dob, 'dd/MM/yyyy')}
          placeholder="Date of Birth (DD/MM/YYYY)"
          onClicked={() => {
            setIsDatePickerVisible(true);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Gender}
          rightAccImage={CustomFonts.ChevronDown}
          value={gender}
          placeholder='Select Gender'
          onClicked={() => {
            setIsGenderVisible(true);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Handshake}
          rightAccImage={CustomFonts.ChevronDown}
          value={relation}
          placeholder="Select relation"
          onClicked={() => {
            setIsRelationVisible(true);
          }}
        />
        {dependents && dependents.length > 0 ?
          <>
            <SKButton
              marginTop={30}
              fontSize={16}
              borderWidth={1}
              leftImage={CustomFonts.black_plus}
              fontWeight={'normal'}
              titleColor={Colors.PRIMARY_BORDER}
              backgroundColor={Colors.WHITE}
              borderColor={Colors.PRIMARY_BORDER}
              title={'ADD ANOTHER DEPENDENT'}
              onPress={() => {
                if (dependents?.length < 20) {
                  if (checkFormValidations()) {
                    const params = prepareParamsForSave()
                    dependents.push(params)
                    navigation.push('Dependents', {isFetched :isDependentFetched, alreadyAddedDependents: dependents });
                  }
                } else {
                  Alert.alert('SukhTax', 'You are not allowed to add more than 10 dependents.')
                }
              }}
            />
            <SKButton
              marginTop={30}
              fontSize={16}
              rightImage={CustomFonts.right_arrow}
              fontWeight={'normal'}
              backgroundColor={Colors.PRIMARY_FILL}
              borderColor={Colors.PRIMARY_BORDER}
              title={'MY TAX YEAR'}
              onPress={() => {
                if (dependents && dependents.length > 0) {
                  setIsLoading(true)
                  dependents.forEach(params => {
                    const update = prepareParams(params)
                    onlineSaveDependentInfo(update, (depRes) => {
                      setIsLoading(false)
                      navigation.navigate('MyTaxYear', { pageIndex: 0 });
                    })
                  })
                } else {
                  Alert.alert('Sukhtax', 'Please add at least dependent.')
                }
              }}
            />
          </>
          :
          <>
            <SKButton
              marginTop={30}
              fontSize={16}
              borderWidth={1}
              leftImage={CustomFonts.black_plus}
              fontWeight={'normal'}
              titleColor={Colors.PRIMARY_BORDER}
              backgroundColor={Colors.WHITE}
              borderColor={Colors.PRIMARY_BORDER}
              title={'ADD THIS DEPENDENT'}
              onPress={() => {
                if (checkFormValidations()) {
                  const params = prepareParamsForSave()
                  dependents.push(params)
                  navigation.push('Dependents', {isFetched:isDependentFetched, alreadyAddedDependents: dependents });
                }
              }}
            />
            <SKButton
              marginTop={15}
              fontSize={16}
              rightImage={CustomFonts.right_arrow}
              fontWeight={'normal'}
              backgroundColor={Colors.PRIMARY_FILL}
              borderColor={Colors.PRIMARY_BORDER}
              title={'MY TAX YEAR'}
              onPress={() => {
                if (dependents && dependents.length > 0) {
                  setIsLoading(true)
                  dependents.forEach(params => {
                    const update = prepareParams(params)
                    onlineSaveDependentInfo(update, (depRes) => {
                      if (depRes.status == 1) {
                        setIsLoading(false)
                        navigation.navigate('MyTaxYear', { pageIndex: 0 });  
                      } else {
                        Alert.alert('Sukhtax', 'Something went wrong.')
                      }
                    })
                  })
                } else {
                  Alert.alert('Sukhtax', 'Please add at least dependent.')
                }
              }}
            />
          </>
        }
      </ScrollView>
      {isDatePickerVisible && (
        <SKDatePicker
          originalDate={new Date()}
          maximumDate={new Date()}
          title={'Select date'}
          onCancelPressed={(date) => {
            setIsDatePickerVisible(false)
            setDOB(date);
          }}
          onDonePressed={(date) => {
            setDOB(date);
            setIsDatePickerVisible(false)
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
            setGender(value)
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
            setRelation(value)
            setIsRelationVisible(false);
          }}
        />
      )}
    </View>
  );
};

const DepCard = props => {
  const { item, isSelected } = props;
  const { first_name, last_name, Relationship } = item
  if (!first_name) return null
  return (
    <TouchableOpacity
      style={{
        marginTop: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.APP_BLUE_HEADING_COLOR,
          fontSize: 18,
          fontFamily: CustomFonts.OpenSansRegular,
          fontWeight: '700',
        }}>
        {`${first_name.toUpperCase()} ${last_name.toUpperCase()}`}
        <Text
          style={{
            width: '100%',
            textAlign: 'left',
            color: Colors.APP_BLUE_HEADING_COLOR,
            fontSize: 13,
            fontFamily: CustomFonts.OpenSansRegular,
            fontStyle: 'italic'
          }}>
          {`  (${Relationship})`}
        </Text>
      </Text>
      <View style={{ backgroundColor: Colors.BLACK, height: .4, width: '100%', marginTop: 5 }} />
    </TouchableOpacity>
  );
};


const AddedDependentView = (props) => {
  const { data } = props
  const [depes, setDepes] = useState(data)
  console.log('data',data,depes)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setDepes(data)
  }, [data])

  return (
    <TouchableOpacity
      style={{ marginTop: 20 }}
      onPress={() => {
        setIsExpanded(!isExpanded)
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.APP_BLUE_HEADING_COLOR }}>
          {`${data.length} DEPENDENT${data.length < 2 ? '' : 'S'}`}
        </Text>
        <Icon
          style={{ position: 'absolute', right: 0 }}
          name={isExpanded ? CustomFonts.ChevronUp : CustomFonts.ChevronDown}
          size={25}
          color={Colors.APP_BLUE_HEADING_COLOR}
        />
      </View>
      {isExpanded &&
        <FlatList
          style={{ width: '100%' , paddingHorizontal:20}}
          data={depes}
          keyExtractor={(item, index) => 'key_' + index}
          renderItem={({ item }) => (
            <DepCard
              item={item}
            />
          )}
        />
      }
    </TouchableOpacity>
  )
}

export default Dependents;
