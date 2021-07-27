import React, {useState, useRef} from 'react';
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
  Text,
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
import {onlineUploadAuthrizationDocumentBS64} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
import SignatureCapture from 'react-native-signature-capture';
import ViewShot from 'react-native-view-shot';

const SignaturePage = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  console.log('pageParams',pageParams)
  const [fName, setFName] = useState('name');
  const [lName, setLName] = useState('name');
  const [sinNo, setSinNo] = useState('12345632');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(true);
  const [isSignStart, setIsSignStart] = useState(false);
  const [isSignSaved, setIsSignSaved] = useState(false);
  const signPad = useRef(null);
  const viewShotRef = useRef(null);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName, ST_REGEX.FName);
    const isLNameValid = Validator.isValidField(lName, ST_REGEX.LName);
    const isSinValid = sinNo.length > 5;

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid First name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Last name');
    }else if (!isSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid SIN.');
    } else if (!isAuthChecked) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please authorize us by selecting checkobox');
    } else if (!isSignSaved) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please do sign.');
    }
    return isValidForm;
  };

  const prepareParams = (image, spouseNo) => {
    const userid = global.userInfo?.user_id;
    const taxFileID = global.userInfo?.Tax_File_Id;
    const params = {
      User_Id: userid,
      Tax_File_Id: taxFileID || 83,
      Title: `Customer_Authorization${spouseNo}`,
      FileNameWithExtension: `Customer_Authorization${spouseNo}`,
      Base64String: image,
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
      <ScrollView
      alwaysBounceVertical ={false}
        contentContainerStyle={{paddingBottom: 10}}
        style={{
          width: '100%',
          paddingHorizontal: 20,
          marginBottom: 80,
        }}>
        <ViewShot
          ref={viewShotRef}
          options={{
            format: 'jpg',
            quality: 0.3,
            height: 10,
            width: 10,
            result: 'base64',
          }}>
          <Heading
            fontSize={20}
            value="AUTHORIZE A REPRESENTATIVE-SIGNATURE PAGE"
            marginTop={26}
          />
          <Heading
            fontSize={16}
            marginTop={45}
            color={Colors.CLR_D9272A}
            value="TAX PAYER INFORMATION"
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            marginTop={20}
            marginBottom={0}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={lName}
            placeholder="First Name"
            onEndEditing={value => {
              setFName(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            marginTop={20}
            marginBottom={0}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={lName}
            placeholder="Last Name"
            onEndEditing={value => {
              setLName(value);
            }}
          />
          <SKInput
            leftAccImage={CustomFonts.Number}
            marginTop={20}
            marginBottom={0}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={sinNo}
            placeholder="SIN Number"
            onEndEditing={value => {
              setSinNo(value);
            }}
          />
          <SKCheckbox
            isChecked={isAuthChecked}
            onToggle={() => {
              setIsAuthChecked(!isAuthChecked);
            }}
          />
          <Heading
            fontSize={12}
            marginTop={10}
            color={Colors.CLR_D9272A}
            value="BY SIGNING AND DATING THIS PAGE, YOU AUTHORIZE THE CANADA REVENUE AGENCY TO INTRACT WITH SUKH TAX AND FINANCIAL SERVICES, WITH REF ID H6YX7GS,GROUP ID:G, UNDER LEVEL 2 OF AUTHORIZATION, WHERE SUKHTAX AND FINANCIAL SERVICES HAS THE ABILITY TO DISCLOSE AND REQUEST. I AGREE TO NO EXPIRY DATE ON THIS AUTHORIZARION, AND UNDERSTAND THAT I CAN CONTACT THE CANADA REVENUE AGENCY DIRECTLY AT A LATER TIME TO RECIND THIS AUTHORIZARION"
          />
          <Heading
            fontSize={13}
            value="SIGNATURE OF TAXPAYER OR LEGAL REPRESENTATIVE"
            marginTop={26}
          />
          <View
            style={{
              backgroundColor: 'green',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <SignatureCapture
              style={{width: '100%', height: 200}}
              ref={signPad}
              onSaveEvent={result => {
                console.log('onSaveEvent', result, result.pathName);
              }}
              onDragEvent={() => {
                console.log('onDragEvent');
                setIsSignStart(true);
                setIsSignSaved(false);
              }}
              saveImageFileInExtStorage={true}
              showNativeButtons={false}
              showTitleLabel={false}
              backgroundColor={Colors.WHITE}
              strokeColor={Colors.BLACK}
              minStrokeWidth={4}
              maxStrokeWidth={4}
              viewMode={'portrait'}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}
                onPress={() => {
                  console.log('sdsd');
                  signPad.current.resetImage();
                  setIsSignSaved(false);
                }}>
                <Icon name={'refresh'} size={30} color={Colors.PRIMARY_FILL} />
              </TouchableOpacity>
              {isSignStart && (
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                  onPress={() => {
                    console.log('sdsd');
                    setIsSignStart(false);
                    setIsSignSaved(true);
                  }}>
                  <Icon
                    name={'content-save-outline'}
                    size={30}
                    color={Colors.CLR_29295F}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ViewShot>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 30,
          paddingHorizontal: 20,
        }}>
        <SKButton
          fontSize={16}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            if (checkFormValidations()) {
              viewShotRef.current.capture().then(bs64Image => {
                setIsLoading(true)
                const params = prepareParams(bs64Image, 1);
                onlineUploadAuthrizationDocumentBS64(params, signUploadRes => {
                  console.log('signUploadRes', signUploadRes);
                  setIsLoading(false)
                  if(pageParams.authIndex == 0){
                    global.isFAuthorized = true
                  }else if(pageParams.authIndex == 1){
                    global.isSAuthorized = true
                  }else if(pageParams.authIndex == 2){
                    global.isTAuthorized = true
                  }
                  if(global.isFromSpouseFlow){
                    global.isAuthorized = global.isFAuthorized && global.isSAuthorized
                  }else{
                    global.isAuthorized = global.isFAuthorized
                  }
                  navigation.goBack()
                });
              });
            }
          }}
        />
      </View>
    </View>
  );
};

const SKCheckbox = props => {
  const {isChecked, onToggle} = props;
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
      }}
      onPress={() => {
        onToggle && onToggle();
      }}>
      <Icon
        name={isChecked ? 'check-box-outline' : 'checkbox-blank-outline'}
        size={20}
        color={Colors.GRAY}
      />
      <Text style={{color: Colors.CLR_29295F, marginLeft: 10, flex: 1}}>
        I authorize SukhTax and Financial Services as per below.
      </Text>
    </TouchableOpacity>
  );
};

export default SignaturePage;
