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
import TouchableInput from '../components/TouchableInput';
import SKModel from '../components/SKModel';
import { useNavigation } from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import { ST_REGEX } from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import { refRegister,getInstitutionList } from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';

import SignatureCapture from 'react-native-signature-capture';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RoyaltySignup = props => {
  const navigation = useNavigation();
  const [bank, setBank] = useState();
  const [banks, setBanks] = useState();
  const [accountNo, setAccountNo] = useState();
  const [branchNo, setBranhcNo] = useState();
  const [isAuthChecked, setIsAuthChecked] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isBankVisible, setIsBankVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    getInstitutionList({}, instRes => {
      setBanks(instRes?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });
      }, []);

      const checkFormValidations = () => {
        let isValidForm = true;
        const isBankValid = bank?.institution_id > 0;
        const isAccValid = accountNo?.length;
        const isBranchValid = branchNo?.length == 5;
    
        if (!isBankValid) {
          isValidForm = false;
          Alert.alert('SukhTax', 'Please select valid Institution.');
        } else if (!isAccValid) {
          isValidForm = false;
          Alert.alert('SukhTax', 'Please enter valid account number.');
        } else if (!isBranchValid) {
          isValidForm = false;
          Alert.alert('SukhTax', 'Please enter valid branch code.');
        }  else if (!isAuthChecked) {
          isValidForm = false;
          Alert.alert('SukhTax', 'Have you read terms and conditions if reviewed please accept');
        }   
        return isValidForm;
      };
    
      const prepareParams = () => {
        const {user_id} = global.onlineStatusData
        const params = {
          User_Id: user_id,
          Institiution_Id:bank?.institution_id,
          Account_Number: accountNo,
          Branch_Number: branchNo
        };
        return params;
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
            value="We just need your direct deposit information for payout, we have the rest of your information."
          />
           <TouchableInput
              leftAccImage={CustomFonts.Bank}
              rightAccImage={CustomFonts.ChevronDown}
              placeholder="Select Bank"
              value={bank?.institution_name}
              onClicked={() => {
                setIsBankVisible(true);
              }}
            />
            <SKInput
              marginTop={10}
              maxLength={30}
              leftAccImage={CustomFonts.Number}
              borderColor={Colors.CLR_0065FF}
              value={accountNo}
              keyboardType="number-pad"
              placeholder="Enter Account Number"
              onEndEditing={value => {
                setAccountNo(value);
              }}
            />
            <SKInput
              marginTop={10}
              marginBottom={0}
              leftAccImage={CustomFonts.Number}
              maxLength={30}
              borderColor={Colors.CLR_0065FF}
              value={branchNo}
              keyboardType="number-pad"
              placeholder="Enter Branch Number"
              onEndEditing={value => {
                setBranhcNo(value);
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
              if(checkFormValidations()){
                setIsLoading(true)
                const params = prepareParams()
                refRegister(params, (res) =>{
                  setIsLoading(false)
                  console.log('refRegister res', res)
                  if(res?.status == 1){
                    navigation.navigate('RoyaltyWallat')
                  }
                })
              }
            }}
          />
        </ScrollView>

        {isBankVisible && banks  &&  (
        <SKModel
          title="Select"
          data={banks}
          keyLabel="institution_name"
          onClose={() => {
            setIsBankVisible(false);
          }}
          onSelect={value => {
            setBank(value);
            setIsBankVisible(false);
          }}
        />
      )}
      </KeyboardAvoidingView>
    </View>
  );
};
const SKCheckbox = props => {
  const { isChecked, onToggle, size = 25 } = props;
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
        size = {size}
        color={Colors.APP_BLUE_HEADING_COLOR}
      />
      <Text style={{ color: Colors.BLACK, marginLeft: 10, flex: 1, fontSize: 15 }}>
        I agree to the terms and conditions as enclosed here.
      </Text>

    </TouchableOpacity>

  );
};

export default RoyaltySignup;
