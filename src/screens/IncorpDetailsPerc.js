import React, {useState} from 'react';
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
import {incorpSaveIncorporatorDetails, incorpUpdateIncorporatorDetails} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';

// Incorporation_Save_Incorporator_Detail
const IncorpDetailsPerc = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [address, setAddress] = useState(pageParams?.Address);
  const [ownershipPerc, setOwnershipPerc] = useState(pageParams?.Ownership_Percentage);
  const [isLoading, setIsLoading] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isMailingAddValid = address?.length > 0
    const isPercValid = ownershipPerc > 0;
    if (!isMailingAddValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Address.');
    } else if (!isPercValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Percentage Ownership.');
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
      <KeyboardAvoidingView
        behavior={'position'}
        enabled={false}
        style={{backgroundColor: Colors.WHITE, flex: 1}}
        // keyboardVerticalOffset={-150}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            flex: 1,
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
            maxLength={50}
            borderColor={Colors.CLR_0065FF}
            value={address}
            placeholder="Address"
            onEndEditing={value => {
              setAddress(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.Number}
            marginBottom={2}
            maxLength={10}
            borderColor={Colors.CLR_0065FF}
            value={ownershipPerc}
            placeholder="PERCENTAGE OWNERSHIP(%)"
            onEndEditing={value => {
              setOwnershipPerc(value);
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
                setIsLoading(true);
                const params = {
                  ...pageParams,
                  Address: address,
                  Ownership_Percentage: ownershipPerc,
                };
                if(pageParams?.Incorporator_Id > 0){ /// updation case
                  incorpUpdateIncorporatorDetails(params, updateRes => {
                    setIsLoading(false);
                    setTimeout(() => {
                      if (updateRes?.status == 1) {
                        navigation.navigate('IncorporatorsList');
                      } else {
                        const msg =
                        updateRes?.message ??
                          'Something went wront, Please try again later.';
                        Alert.alert('SukhTax', msg);
                      }
                    }, 300);
                  });
                }else{
                  incorpSaveIncorporatorDetails(params, saveRes => {
                    setIsLoading(false);
                    setTimeout(() => {
                      if (saveRes?.status == 1) {
                        navigation.navigate('IncorporatorsList');
                      } else {
                        const msg =
                          saveRes?.message ??
                          'Something went wront, Please try again later.';
                        Alert.alert('SukhTax', msg);
                      }
                    }, 300);
                  });
                }
              }
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default IncorpDetailsPerc;
