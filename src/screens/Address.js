import React, {useState, useEffect, useRef} from 'react';
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
import * as Colors from '../constants/ColorDefs';
import {getCanadaProvinceList, saveAboutInfo} from '../apihelper/Api';
import SKModel from '../components/SKModel';
import SKGGLAddressModel from '../components/SKGGLAddressModel';
import * as CustomFonts from '../constants/FontsDefs';
import {format} from 'date-fns';
import * as SKTStorage from '../helpers/SKTStorage';

const Address = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [mailingAddress, setMailingAddress] = useState();
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isProvinceVisible, setIsProvinceVisible] = useState(false);
  const [isAddViewVisible, setIsAddViewVisible] = useState(false);

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
    const isMailingAddValid = mailingAddress?.length > 0;
    const isProvinceValid = province?.state_id;
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
    const {user_id} = global.onlineStatusData;
    const commaSepYrs = global.selectedYears && global.selectedYears.join();
    const dob = pageParams.dob && format(pageParams.dob, 'yyyy-MM-dd');
    const params = {
      User_Id: user_id,
      SIN_Number: pageParams.sin,
      Gender: pageParams.gender,
      DOB: dob,
      Last_Year_Tax_Filed: pageParams.lastTime,
      Mailing_Address: mailingAddress,
      Year: global?.mostRecentYear,
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
        flex:1
      }}>
      {isLoading && <SKLoader />}
      <AppHeader navigation={navigation} />
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          flex:1
        }}>
          <Heading value="ADDRESS" marginTop={26} />
          <Heading
            fontSize={16}
            marginTop={45}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="WHAT IS YOUR MAILING ADDRESS?"
          />
          <TouchableInput
            rightAccImage={CustomFonts.ChevronDown}
            marginBottom={2}
            height = {80}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={mailingAddress}
            placeholder="Enter Mailing Address"
            onClicked={() => {
              setIsAddViewVisible(true);
            }}
          />
          <Heading
            fontSize={16}
            marginTop={30}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value={`WHICH PROVINCE DID YOU LIVE IN ON DECEMBER 31, ${global.mostRecentYear}?`}
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
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BANKING'}
          onPress={() => {
            if (checkFormValidations()) {
              setIsLoading(true);
              const params = prepareParams();
              saveAboutInfo(params, saveRes => {
                setIsLoading(false);
                if (saveRes?.status == -1) {
                  Alert.alert('SukhTax', 'Something went wrong');
                  return;
                }
                global.onlineStatusData = {
                  ...global.onlineStatusData,
                  ...saveRes?.data[0],
                };
                SKTStorage.setKeyValue('province',province, ()=>{
                  navigation.navigate('BankingAndMore', {province: province});
                })
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
        {isAddViewVisible && (
          <SKGGLAddressModel
            onClose={() => {
              setIsAddViewVisible(false);
            }}
            onSelectAddress={value => {
              setMailingAddress(value);
              setIsAddViewVisible(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Address;
