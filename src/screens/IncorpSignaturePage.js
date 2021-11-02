import React, {useState, useRef, useEffect} from 'react';
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
import {incorpUploadAuthImage, incorpGetIncorporatorDetails} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as CustomFonts from '../constants/FontsDefs';
import SignatureCapture from 'react-native-signature-capture';
import ViewShot from 'react-native-view-shot';
import * as SKTStorage from '../helpers/SKTStorage'


const IncorpSignaturePage = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [fName, setFName] = useState('');
  const [mName, setMName] = useState();
  const [lName, setLName] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState('');
  const [sinNo, setSinNo] = useState('');
  const [authName, setAuthName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(true);
  const [isSignStart, setIsSignStart] = useState(false);
  const [isSignSaved, setIsSignSaved] = useState(false);
  const signPad = useRef(null);
  const viewShotRef = useRef(null);

  SKTStorage.getValue('selectedCategory', (cat)=>{console.log('selectedCategory',cat)})
  SKTStorage.getValue('selectedCorp', (corp)=>{console.log('selectedCorp',corp)})
  

  const checkFormValidations = () => {
    let isValidForm = true;
    const isAuthNameValid = Validator.isValidField(authName,ST_REGEX.FullName)
     if (!isAuthNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid authorizer name.');
    } else if (!isSignSaved) {
      isValidForm = false;
      Alert.alert('SukhTax', 'You need to sign and save.');
    } 
    return isValidForm;
  };

  useEffect(() => {
    const {user_id, incorporation_id, incorporator_id} = pageParams;
      const params = {
        User_Id: user_id,
        Incorporation_Id: incorporation_id,
        Incorporator_Id: incorporator_id,
      };
      incorpGetIncorporatorDetails(params, detailsRes => {
        setIsLoading(false);
        if (detailsRes?.status == 1) {
          const data = detailsRes?.data?.[0];
          const {
            first_name,
            middle_name,
            last_name,
            phone_number,
            alt_phone_number,
            SIN_number,
            email,
            address
          } = data;
          setFName(first_name);
          setLName(last_name);
          setMName(middle_name);
          setAddress(address)
          setEmail(email);
          setMobile(phone_number);
          setAltMobile(alt_phone_number);
          setSinNo(SIN_number);
        }
      });
  }, [])

  const prepareParams = (image) => {
    const {incorporation_id,incorporator_id, user_id} = pageParams
    const params = {
      User_Id: user_id,
      Incorporation_Id: incorporation_id,
      Title: `Incorporator_Authorization_${incorporator_id}`,
      FileNameWithExtension: `Incorporator_Authorization_${incorporator_id}.jpg`,
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
            height: 400,
            width: 300,
            result: 'base64',
          }}>
          <Heading
            fontSize={20}
            value="AUTHORIZE A REPRESENTATIVE-SIGNATURE PAGE"
            marginTop={26}
          />
          <Heading
            fontSize={16}
            marginTop={20} 
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="INCORPORATION DETAILS:"
          />
          <Heading
            fontSize={14}
            color={Colors.APP_BLUE_HEADING_COLOR}
            value={global?.selectedCorp?.incorporation_type}
          />
           <Heading
            fontSize={14}
            color={Colors.APP_BLUE_HEADING_COLOR}
            value={global?.selectedCategory?.incorporation_type}
          />
          <Heading
            fontSize={16}
            marginTop={20} 
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="INCORPORATOR'S DETAILS"
          />
          <SKInput
            editable = {false}
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
            editable = {false}
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
            editable = {false}
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
          editable = {false}
          leftAccImage={CustomFonts.Home}
          marginTop={20}
          height = {100}
          multiline={true}
          returnKeyType="done"
          blurOnSubmit={true}
          borderColor={Colors.CLR_0065FF}
          value={address}
          placeholder="Address"
          onEndEditing={value => {
            console.log('value', value)
            setAddress(value);
          }}
        />

          <SKInput
            editable = {false}
            leftAccImage={CustomFonts.Phone}
            marginBottom={2}
            maxLength={10}
            borderColor={Colors.CLR_0065FF}
            value={mobile}
            keyboardType = 'number-pad'
            placeholder="Phone Number"
            onEndEditing={value => {
              setMobile(value);
            }}
          />

          <SKInput
            editable = {false}
            leftAccImage={CustomFonts.Phone}
            marginBottom={2}
            maxLength={10}
            borderColor={Colors.CLR_0065FF}
            value={altMobile}
            keyboardType = 'number-pad'
            placeholder="Alternate Phone Number"
            onEndEditing={value => {
              setAltMobile(value);
            }}
          />
          <SKInput
            editable = {false}
            leftAccImage={CustomFonts.Email}
            marginBottom={2}
            maxLength={30}
            autoCapitalize = 'none'
            borderColor={Colors.CLR_0065FF}
            value={email}
            placeholder="Email Address"
            onEndEditing={value => {
              setEmail(value);
            }}
          />

          <SKInput
            editable = {false}
            leftAccImage={CustomFonts.Number}
            marginTop={20}
            marginBottom={0}
            maxLength={9}
            borderColor={Colors.CLR_0065FF}
            value={sinNo}
            keyboardType = 'number-pad'
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
            fontSize={13}
            value="AUTHORIZER"
            marginTop={20}
          />
           <SKInput
            leftAccImage={CustomFonts.UserIcon}
            marginBottom={2}
            maxLength={30}
            autoCapitalize = 'none'
            borderColor={Colors.CLR_0065FF}
            value={authName}
            placeholder="Email Authorizer name"
            onEndEditing={value => {
              setAuthName(value);
            }}
          />
          <Heading
            fontSize={13}
            value="SIGNATURE"
            marginTop={20}
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
                    setIsSignStart(false);
                    setIsSignSaved(true);
                  }}>
                  <Icon
                    name={'content-save-outline'}
                    size={30}
                    color={Colors.APP_BLUE_HEADING_COLOR}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
         
        </ViewShot>
        <SKButton
          fontSize={16}
          marginTop  = {20}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            if (checkFormValidations()) {
              viewShotRef.current.capture().then(bs64Image => {
                setIsLoading(true)
                const params = prepareParams(bs64Image);
                incorpUploadAuthImage(params, signUploadRes => {
                  const {incorpAuthIds = []} = global.incStatusData
                  const {incorporator_id} = pageParams
                  incorpAuthIds.push(incorporator_id)
                  global.incStatusData.incorpAuthIds = incorpAuthIds
                  navigation.goBack()
                  setIsLoading(false)
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
      <Text style={{color: Colors.APP_BLUE_HEADING_COLOR, marginLeft: 10, flex: 1}}>
      I authorize you to open my corporation
      </Text>
    </TouchableOpacity>
  );
};

export default IncorpSignaturePage;
