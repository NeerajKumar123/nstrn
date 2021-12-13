import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Button,
  Text,
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import { useNavigation } from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import { ST_REGEX } from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import { incorpGetIncorporatorDetails } from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';

import SignatureCapture from 'react-native-signature-capture';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RoyaltySignup = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [details, setDetails] = useState();
  const [iNSNUMBER, setiNSNUMBER] = useState();
  const [mName, setMName] = useState();
  const [lName, setLName] = useState();
  const [SinName, setSinName] = useState('');

  const [isAuthChecked, setIsAuthChecked] = useState();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pageParams) {
      setIsLoading(true);
      const { user_id, incorporation_id, incorporator_id } = pageParams;
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
            sinName_name
          } = data;
          setiNSNUMBER(first_name);
          setLName(last_name);
          setMName(middle_name);
          setSinName(sinName_name);


        }
      });
    }
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isiNSNUMBERValid = Validator.isValidField(iNSNUMBER, ST_REGEX.FullName)
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.FullName)
    const isMNameValid = true // Validator.isValidField(mName, ST_REGEX.LName);


    if (!isiNSNUMBERValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid INSTUTION NUMBER');
    } else if (!isMNameValid && 0) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Middle Name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Last Name');
    }
    return isValidForm;
  };
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        alignContent: "center"
      }}>
      <AppHeader navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled={true}
        style={{ flex: 1, width: '100%', paddingBottom: 10 }}
        keyboardVerticalOffset={0}>
        {isLoading && <SKLoader />}


        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16
          }}>
          <Heading value="SUKH TAX LOYALTY PROGRAM" marginTop={12} fontWeight={"700"} fontSize={18} color={Colors.APP_RED_SUBHEADING_COLOR} />
          <Heading
            fontSize={19}
            marginTop={5}
            color={Colors.CLR_5F5F94}
            fontWeight={"400"}
            value="We just need your Direct Deposit information for payout, we have the rest of your information. :"
          />
          <SKInput
            marginTop={22}
            marginBottom={0}
            maxLength={15}
            fontWeight={'500'}
            leftAccImage={CustomFonts.Email}
            color={Colors.CLR_FFFFFF}
            backgroundColor={Colors.CLR_FFFFFF}
            value={iNSNUMBER}
            placeholder="Email or phone number"
            onEndEditing={value => {
              setiNSNUMBER(value);
            }}
          />

          <SKInput
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            backgroundColor={Colors.CLR_FFFFFF}
            fontWeight={'500'}
            value={mName}
            keyboardType="number-pad"
            placeholder="Password"
            leftAccImage={CustomFonts.Lock}
            color={Colors.CLR_393F45}
            onEndEditing={value => {
              setMName(value);
            }}
          />
          <SKInput
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={lName}
            autoCapitalize='none'
            color={Colors.CLR_393F45}
            fontWeight={'500'}
            keyboardType="number-pad"
            backgroundColor={Colors.CLR_FFFFFF}
            placeholder="Password"
            leftAccImage={CustomFonts.Lock}
            onEndEditing={value => {
              setLName(value);
              console.log('value======>', value)
            }}
          />
          <SKCheckbox
            isChecked={isAuthChecked}
            onToggle={() => {
              setIsAuthChecked(!isAuthChecked);
            }}
          />

          <SKButton
            marginTop={30}
            fontSize={16}
            fontWeight={'normal'}
            backgroundColor={Colors.CLR_EB0000}
            borderColor={Colors.PRIMARY_BORDER}
            title={'SUBMIT'}
            onPress={() => {
              navigation.navigate('RoyaltyWallat')
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const SKCheckbox = props => {
  const { isChecked, onToggle } = props;
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
      }}
      onPress={() => {
        onToggle && onToggle();
      }}>
      <Icon
        name={isChecked ? 'check-box-outline' : 'checkbox-blank-outline'}
        size={30}
        color={Colors.BLUE}
      />
      <Text style={{ color: Colors.BLACK, marginLeft: 10, flex: 1, fontSize: 15 }}>
        I agree to the terms and conditions as enclosed.here
      </Text>

    </TouchableOpacity>

  );
};

export default RoyaltySignup;
