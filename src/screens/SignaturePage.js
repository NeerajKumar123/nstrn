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
import {onlineUploadAuthrizationDocumentBS64,onlineUpdateSpouseEmailID} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
import SignatureCapture from 'react-native-signature-capture';
import ViewShot from 'react-native-view-shot';

const SignaturePage = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [sinNo, setSinNo] = useState('');
  const [spouseEmailId, setSpouseEmailId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(true);
  const [isSignStart, setIsSignStart] = useState(false);
  const [isSignSaved, setIsSignSaved] = useState(false);
  const signPad = useRef(null);
  const viewShotRef = useRef(null);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isFNameValid = Validator.isValidField(fName,ST_REGEX.FullName)
    const isLNameValid = Validator.isValidField(lName,ST_REGEX.FullName)
    const isSinValid = Validator.isValidSIN(sinNo)
    const isSpouseEmailIdValid = pageParams.authIndex == 1 ?  Validator.isValidField(spouseEmailId,ST_REGEX.Email) : true

    if (!isFNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid First name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Last name');
    }else if (!isSinValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid SIN.');
    }else if (!isSpouseEmailIdValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Spouse Email Id.');
    } else if (!isAuthChecked) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please authorize us by selecting checkobox');
    } else if (!isSignSaved) {
      isValidForm = false;
      Alert.alert('SukhTax', 'You need to sign and save.');
    }
    return isValidForm;
  };

  const prepareParams = (image, spouseNo) => {
    const {user_id,tax_file_id} = global.onlineStatusData
    const params = {
      User_Id: user_id,
      Tax_File_Id: tax_file_id,
      Title: `Customer_Authorization${spouseNo}`,
      FileNameWithExtension: `Customer_Authorization${spouseNo}.jpg`,
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
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}>
          <ViewShot
            ref={viewShotRef}
            options={{
              format: 'jpg',
              quality: 0.8,
              result: 'base64',
            }}>
          <Heading
            fontSize={18}
            value="AUTHORIZE A REPRESENTATIVE SIGNATURE PAGE"
            marginTop={26}
          />
          <Heading
            fontSize={16}
            marginTop={45}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="TAX PAYER INFORMATION"
          />
          <SKInput
            leftAccImage={CustomFonts.UserIcon}
            marginTop={20}
            marginBottom={0}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={fName}
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
            maxLength={9}
            borderColor={Colors.CLR_0065FF}
            value={sinNo}
            placeholder="SIN Number"
            keyboardType = 'number-pad'
            onEndEditing={value => {
              setSinNo(value);
            }}
          />
          {pageParams.authIndex == 1 && 
           <SKInput
           leftAccImage={CustomFonts.Email}
           marginTop={20}
           marginBottom={0}
           maxLength={30}
           borderColor={Colors.CLR_0065FF}
           value={spouseEmailId}
           placeholder="Spouse Email Id"
           onEndEditing={value => {
             setSpouseEmailId(value);
           }}
         />
          }
          <SKCheckbox
            isChecked={isAuthChecked}
            onToggle={() => {
              setIsAuthChecked(!isAuthChecked);
            }}
          />
          <Heading
            fontSize={12}
            marginTop={10}
            color={Colors.APP_RED_SUBHEADING_COLOR}
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
              }}
              onDragEvent={() => {
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
                top: 0,
                width:'100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  alignItems:'center',
                  justifyContent:'center',
                }}
                onPress={() => {
                  signPad.current.resetImage();
                  setIsSignSaved(false);
                }}>
                <Icon name={'refresh'} size={30} color={Colors.PRIMARY_FILL} />
              </TouchableOpacity>
              {isSignStart && (
                <TouchableOpacity
                  style={{
                    paddingHorizontal:10,
                    marginRight:10,
                    marginTop:10,
                    alignItems:'center',
                    justifyContent:'center',
                    borderRadius:6,
                    borderWidth:1,
                    borderColor:Colors.APP_RED_SUBHEADING_COLOR
                  }}
                  onPress={() => {
                    setIsSignStart(false);
                    setIsSignSaved(true);
                  }}>
                  <Text style = {{fontSize:15, fontWeight:'500', color:Colors.APP_RED_SUBHEADING_COLOR}}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ViewShot>
        <SKButton
          fontSize={16}
          marginTop ={20}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            if (checkFormValidations()) {
              if(pageParams.authIndex ==  1 && spouseEmailId){
              //Call API to update Spouse Email id
              const {user_id,tax_file_id} = global.onlineStatusData
              const params = {User_Id:user_id, Tax_File_Id:tax_file_id, Spouse_Email:spouseEmailId}
              onlineUpdateSpouseEmailID(params, emailUpdateRes => {
                console.log('emailUpdateRes',emailUpdateRes)
              })
              }
              //Call API to save Sign
              viewShotRef.current.capture().then(bs64Image => {
                setIsLoading(true)
                const params = prepareParams(bs64Image, 1);
                onlineUploadAuthrizationDocumentBS64(params, signUploadRes => {
                  setIsLoading(false)
                  if(pageParams.authIndex == 0){
                    global.isFAuthorized = true
                  }else if(pageParams.authIndex == 1){
                    global.isSAuthorized = true
                  }else if(pageParams.authIndex == 2){
                    global.isTAuthorized = true
                  }
                  if(pageParams.showOtherAuthorizer){
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
      </ScrollView>
      </KeyboardAvoidingView>
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
        marginTop: 20,
      }}
      onPress={() => {
        onToggle && onToggle();
      }}>
      <Icon
        name={isChecked ? 'check-box-outline' : 'checkbox-blank-outline'}
        size={22}
        color={Colors.GRAY}
      />
      <Text style={{color: Colors.APP_BLUE_HEADING_COLOR, marginLeft: 10, flex: 1,fontSize:15}}>
        I authorize SukhTax and Financial Services as per below.
      </Text>
    </TouchableOpacity>
  );
};

export default SignaturePage;
