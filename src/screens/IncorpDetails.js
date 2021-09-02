import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {incorpGetIncorporatorDetails} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';

const IncorpDetails = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [details, setDetails] = useState();
  const [fName, setFName] = useState();
  const [mName, setMName] = useState();
  const [lName, setLName] = useState();
  const [email, setEmail] = useState();
  const [mobile, setMobile] = useState();
  const [altMobile, setAltMobile] = useState();
  const [sin, setSin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pageParams) {
      setIsLoading(true);
      const {user_id, incorporation_id, incorporator_id} = pageParams.params;
      const params = {
        User_Id: user_id,
        Incorporation_Id: incorporation_id,
        Incorporator_Id: incorporator_id,
      };
      incorpGetIncorporatorDetails(params, detailsRes => {
        setIsLoading(false);
        if (detailsRes?.status == 1) {
          const data = detailsRes?.data?.[0];
          setDetails(data);
          const {
            first_name,
            middle_name,
            last_name,
            phone_number,
            alt_phone_number,
            SIN_number,
            email,
          } = data;
          setFName(first_name);
          setLName(last_name);
          setMName(middle_name);
          setEmail(email);
          setMobile(phone_number);
          setAltMobile(alt_phone_number);
          setSin(SIN_number);
        }
      });
    }
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FName);
    const isMNameValid = Validator.isValidField(mName, ST_REGEX.LName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.LName);
    const isEmailValid = Validator.isValidField(email, ST_REGEX.Email);
    const isMobileValid = Validator.isValidField(mobile, ST_REGEX.Mobile);
    const isAltMobileValid = Validator.isValidField(altMobile, ST_REGEX.Mobile);
    // const isSINValid =  Validator.isValidField(pass, ST_REGEX.)
    const isSINValid = true;

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid First Name');
    } else if (!isMNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Middle Name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Last Name');
    } else if (!isEmailValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Email Address');
    } else if (!isMobileValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Phone Number');
    } else if (!isAltMobileValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Alternate Phone Number');
    } else if (!isSINValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid SIN');
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
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled={true}
        style={{flex: 1, width: '100%', paddingBottom: 10}}
        keyboardVerticalOffset={0}>
        {isLoading && <SKLoader />}
        <AppHeader navigation={navigation} />
        <ScrollView
        style = {{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: 20
          }}>
          <Heading value="ABOUT YOU" marginTop={26} />
          <Heading
            fontSize={16}
            marginTop={5}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="INCORPORATORS' DETAILS :"
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            marginTop={26}
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={fName}
            placeholder="First Name"
            onEndEditing={value => {
              setFName(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={mName}
            placeholder="Middle Name"
            onEndEditing={value => {
              setMName(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={lName}
            placeholder="Last Name"
            onEndEditing={value => {
              setLName(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.Email}
            marginBottom={2}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={email}
            placeholder="Email Address"
            onEndEditing={value => {
              setEmail(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.Phone}
            marginBottom={2}
            maxLength={10}
            borderColor={Colors.CLR_0065FF}
            value={mobile}
            placeholder="Phone Number"
            onEndEditing={value => {
              setMobile(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.Phone}
            marginBottom={2}
            maxLength={10}
            borderColor={Colors.CLR_0065FF}
            value={altMobile}
            placeholder="Alternate Phone Number"
            onEndEditing={value => {
              setAltMobile(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.Number}
            marginBottom={2}
            maxLength={10}
            borderColor={Colors.CLR_0065FF}
            value={sin}
            placeholder="SIN Number"
            onEndEditing={value => {
              setSin(value);
            }}
          />
          <SKButton
            fontSize={16}
            marginTop={33}
            width="100%"
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'NEXT'}
            onPress={() => {
              Keyboard.dismiss();
              if (checkFormValidations()) {
                const {incorporation_id, user_id} = global.incStatusData;
                const params = {
                  User_id: user_id,
                  Incorporation_Id: incorporation_id,
                  First_Name: fName,
                  Middle_Name: mName,
                  Last_Name: lName,
                  Email: email,
                  Phone_No: mobile,
                  Alt_Phone_No: altMobile,
                  SIN: sin,
                  Incorporator_Id:details?.incorporator_id,
                  Address:details?.address,
                  Ownership_Percentage:details?.percentage_ownership
                };
                navigation.navigate('IncorpDetailsPerc', {...params});
              }
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default IncorpDetails;
