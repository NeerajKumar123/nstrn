import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  DeviceEventEmitter,
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import SKInput from '../components/SKInput';
import TouchableInput from '../components/TouchableInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {getAboutInfo} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs'
import {isValidSIN} from '../helpers/SKTValidator';
import * as SKTStorage from '../helpers/SKTStorage';
import {GENDER_OPTIONS, TIME_OPTIONS} from '../constants/StaticValues';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import SKDatePicker from '../components/SKDatePicker';
import {format } from 'date-fns'
const {width} = Dimensions.get('window');

const BasicInfo = props => {
  const navigation = useNavigation();
  const [sin, setsin] = useState('');
  const [gender, setgender] = useState();
  const [dob, setDOB] = useState();
  const [lastTime, setLastTime] = useState();
  const [isLastTimeVisible, setIsLastTimeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState(false);
  const iosVersion = parseInt(Platform.Version);  
  let pickerHeight = 0
  if(Platform.OS == 'ios'){
    pickerHeight = iosVersion >= 14 ? 400 : 216
  }
  const checkFormValidations = () => {
    let isValidForm = true;
    if (!isValidSIN(sin)) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid sin.');
    } else if (gender == undefined) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid gender.');
    }else if (dob == undefined) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid DOB.');
    }else if (lastTime == undefined) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select year when you filed with us.');
    }
    return isValidForm;
  };

  useEffect(() => {
    setIsLoading(true)
    const {tax_file_id,user_id} = global.onlineStatusData
    const params = {User_Id:user_id, Tax_File_Id:tax_file_id,Year:2020 }
    getAboutInfo(params,(aboutRes) =>{
      global.aboutRes = aboutRes
      setIsLoading(false)
    })
  }, [])
  
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
      style = {{flex: 1}}
        contentContainerStyle={{
          paddingHorizontal: 20}}>
        <Heading value="ABOUT YOU" marginTop={30} />
        <Heading
          fontSize={20}
          marginTop={30}
          color={Colors.RED}
          value="WE NEED SOME ADDITIONAL INFO:"
        />
        <SKInput
          marginTop={48}
          marginBottom={0}
          leftAccImage={CustomFonts.Number}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={sin}
          keyboardType = 'number-pad'
          placeholder="SIN Number"
          onEndEditing={value => {
            setsin(value);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Gender}
          rightAccImage={CustomFonts.ChevronDown}
          value = {gender}
          placeholder="Select Gender"
          onClicked={() => {
            setIsGenderVisible(true);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Calender}
          value = {dob && format(dob, 'dd/MM/yyyy')}
          placeholder="Date of Birth (DD/MM/YYYY)"
          onClicked={() => {
            setShowDatePicker(true);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={30}
          color={Colors.RED}
          value="WHEN WAS THE LAST TIME YOU FILED WITH US?"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Clock}
          rightAccImage={CustomFonts.ChevronDown}
          value={lastTime}
          placeholder="Select"
          onClicked={() => {
            setIsLastTimeVisible(true);
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'ADDRESS'}
          onPress={() => {
            if (checkFormValidations()) {
              SKTStorage.setKeyValue('lastTime',lastTime,()=>{
                const nextPageParams = {sin:sin,gender:gender, dob:dob,lastTime:lastTime }
                navigation.navigate('Address',{...nextPageParams});    
              })
            }
          }}
        />
        {isGenderVisible && (
          <SKModel
            title="Select Gender"
            data={GENDER_OPTIONS}
            onClose={() => {
              setIsGenderVisible(false);
            }}
            onSelect={value => {
              setgender(value)
              setIsGenderVisible(false);
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
              setLastTime(value)
              setIsLastTimeVisible(false);
            }}
          />
        )}
      </ScrollView>
      {showDatePicker && (
        <SKDatePicker
        originalDate = {new Date()}
        maximumDate = {new Date()}
        title = {'Select date'}
        onCancelPressed = {(date)=>{
          setShowDatePicker(false)
          setDOB(date);
        }}
        onDonePressed = {(date)=>{
          setDOB(date);
          setShowDatePicker(false)
        }}
        />
      )}
    </View>
  );
};

export default BasicInfo;
