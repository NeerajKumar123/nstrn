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
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {login} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import {GENDER_OPTIONS} from '../constants/StaticValues';
import SKLoader from '../components/SKLoader';
import SKModel from '../components/SKModel';
const user = require('../../assets/user.png');
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const BasicInfo = props => {
  const navigation = useNavigation();
  const [sin, setsin] = useState('');
  const [gender, setgender] = useState('MALE');
  const [dob, setDOB] = useState('');
  const [lastTime, setLastTime] = useState('FIRST');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState(false);

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
          leftAccImage={user}
          maxLength={30}
          borderColor={Colors.CLR_0065FF}
          value={sin}
          placeholder="SIN Number"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setsin(value);
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          maxLength={10}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={gender}
          placeholder="Gender"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setgender(value);
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          maxLength={10}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={dob}
          placeholder="Date of Birth (DD/MM/YYYY)"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setgender(value);
          }}
        />
        <Heading
          fontSize={20}
          marginTop={30}
          color={Colors.RED}
          value="WHEN THE LAST TIME YOU FILED WITH US?"
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          maxLength={10}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={lastTime}
          placeholder="Date of Birth (DD/MM/YYYY)"
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setgender(value);
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
            // setShowDatePicker(true)
            // return
            setIsGenderVisible(true);
            return;
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
              setIsGenderVisible(false);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default BasicInfo;
