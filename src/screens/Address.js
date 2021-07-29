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
import {getCanadaProvinceList, saveAboutInfo} from '../apihelper/Api';
import SKModel from '../components/SKModel';
import * as CustomFonts from '../constants/FontsDefs';
import {format } from 'date-fns'
const Address = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [mailingAddress, setMailingAddress] = useState();
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isProvinceVisible, setIsProvinceVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const params = {};
    getCanadaProvinceList(params, provinceRes => {
      setIsLoading(false);
      setProvinces(provinceRes?.data);
    });
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isMailingAddValid = mailingAddress?.length > 0
    const isProvinceValid = province?.state_id

    if (!isMailingAddValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Mailing address');
    } else if (!isProvinceValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid province');
    }
    return isValidForm;
  };

  const prepareParams = () => {
    const userid = global.userInfo?.user_id;
    const commaSepYrs = global.selectedYears.join();
    const dob = pageParams.dob && format(pageParams.dob, 'yyyy-MM-dd')
    const params = {
      User_Id: userid,
      SIN_Number: pageParams.sin,
      Gender: pageParams.gender,
      DOB: dob,
      Last_Year_Tax_Filed: pageParams.lastTime,
      Mailing_Address: mailingAddress,
      Year: 2020,
      Module_Type_Id: 2,
      Years_Selected: commaSepYrs,
    };
    return params;
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
      <AppHeader navigation={navigation} />
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
            color={Colors.APP_RED_SUBHEADING_COLOR}
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
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="WHICH PROVOINCE DID YOU LINE IN ON DECEMBER 31, 2020?"
          />
          <TouchableInput
            rightAccImage={CustomFonts.ChevronDown}
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={province?.state_name}
            placeholder="Select Province"
            onClicked={() => {
              setIsProvinceVisible(true);
            }}
          />
        </KeyboardAvoidingView>
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BANKING'}
          onPress={() => {
            if(checkFormValidations()){
              setIsLoading(true)
              const params = prepareParams();
            saveAboutInfo(params, saveRes => {
              setIsLoading(false)
              if (saveRes?.status == -1){
                Alert.alert('SukhTax','Something went wrong')
                return
              }
              global.userInfo = {...global.userInfo,...saveRes?.data[0]}
              navigation.navigate('BankingAndMore', {province:province});
            });
            }            
          }}
        />
        {isProvinceVisible && (
          <SKModel
            title="Select"
            data={provinces}
            keyLabel="state_name"
            onClose={() => {
              setIsProvinceVisible(false);
            }}
            onSelect={value => {
              setProvince(value);
              setIsProvinceVisible(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Address;
