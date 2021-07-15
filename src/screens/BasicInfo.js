import React, {useState} from 'react';
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
import {login} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs'
import * as SKTStorage from '../helpers/SKTStorage';
import {GENDER_OPTIONS, TIME_OPTIONS} from '../constants/StaticValues';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format } from 'date-fns'
const {width} = Dimensions.get('window');

const user = require('../../assets/user.png');
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const BasicInfo = props => {
  const navigation = useNavigation();
  const [sin, setsin] = useState('');
  const [gender, setgender] = useState('');
  const [dob, setDOB] = useState();
  const [lastTime, setLastTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState(false);
  const [isLastTimeVisible, setIsLastTimeVisible] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    if (sin == undefined || sin.length < 10) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid sin.');
    } else if (gender == undefined || gender.length < 6) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid genderword.');
    }
    return isValidForm;
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
          flex: 1,
        }}>
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
            console.log('onEndEditing', value);
            setsin(value);
          }}
        />
        <TouchableInput
          leftAccImage={CustomFonts.Gender}
          rightAccImage={CustomFonts.ArrowDown}
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
          value="WHEN THE LAST TIME YOU FILED WITH US?"
        />
        <TouchableInput
          leftAccImage={CustomFonts.Clock}
          rightAccImage={CustomFonts.ArrowDown}
          value={lastTime}
          placeholder="Select"
          onClicked={() => {
            console.log('sdsd');
            setIsLastTimeVisible(true);
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'ADDRESS'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('Address');
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
              console.log('value', value);
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
              console.log('value', value);
              setLastTime(value)
              setIsLastTimeVisible(false);
            }}
          />
        )}
      </ScrollView>
      {showDatePicker && (
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
            display="inline"
            onChange={(event, selectedDate) => {
              console.log(event.type, Date.parse(selectedDate));
              setDOB(selectedDate)
              console.log('====>',format(selectedDate, 'dd/MM/yyyy'))
              // setDisplayDOB()
              setShowDatePicker(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default BasicInfo;
