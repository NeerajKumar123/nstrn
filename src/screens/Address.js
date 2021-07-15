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
import SKModel from '../components/SKModel'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
const right_arrow = require('../../assets/right_arrow.png');
const user = require('../../assets/user.png');

const Address = props => {
  const navigation = useNavigation();
  const [mailingAddress, setMailingAddress] = useState('');
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState([{name:'Province 1'},{name:'Province 2'},{name:'Province 3'},{name:'Province 4'},{name:'Province 5'},{name:'Province 6'}])
  const [isLoading, setIsLoading] = useState(false);
  const [isProvinceVisible, setIsProvinceVisible] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isMailingAddValid = Validator.isValidField(
      mailingAddress,
      ST_REGEX.FName,
    );
    const isProvinceValid = Validator.isValidField(province, ST_REGEX.LName);

    if (!isMailingAddValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Mailing address');
    } else if (!isProvinceValid) {
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
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <KeyboardAvoidingView
          behavior={'position'}
          enabled={true}
          keyboardVerticalOffset={-200}>
          <Heading value="ADDRESS" marginTop={26} />
          <Heading
            fontSize={16}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="WHAT IS YOUR MAILING ADDRESS?"
          />
          <SKInput
            multiline={false}
            marginTop={20}
            marginBottom={0}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={mailingAddress}
            placeholder="Mailing Address"
            onEndEditing={value => {
              setMailingAddress(value);
            }}
          />
          <Heading
            fontSize={16}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="WHICH PROVOINCE DID YOU LINE IN ON DECEMBER 31, 2020?"
          />
          <TouchableInput
            rightAccImage={CustomFonts.ArrowDown}
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={province?.name}
            placeholder="Select Province"
            onClicked={() => {
              console.log('sdsd');
              setIsProvinceVisible(true);
            }}          />
        </KeyboardAvoidingView>
        <SKButton
        marginTop = {30}
          fontSize={16}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BANKING'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('BankingAndMore');
          }}
        />
        {isProvinceVisible && (
          <SKModel
            title="Select"
            data={provinces}
            keyLabel = 'name'
            onClose={() => {
              setIsProvinceVisible(false);
            }}
            onSelect={value => {
              console.log('isProvinceVisible', value);
              setProvince(value)
              setIsProvinceVisible(false);
            }}
          />
        )}
      </View>
      
    </View>
  );
};

export default Address;
