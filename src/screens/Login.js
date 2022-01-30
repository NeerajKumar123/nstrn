import React, {useState,useEffect} from 'react';
import {TouchableOpacity, View, Alert, ScrollView, Image,DeviceEventEmitter, Keyboard,Platform,KeyboardAvoidingView} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {login, updateDeviceIDAndOS} from '../apihelper/Api'
import * as SKTStorage from '../helpers/SKTStorage'
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs'
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues'
import messaging from '@react-native-firebase/messaging';
const Login = props => {
  const navigation = useNavigation();
  const [email, setemail] = useState('')
  const [pass, setPass] = useState('')
  const [isSecurePass, setIsSecurePass] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
   }, []);

   async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      getFcmToken()
      console.log('Authorization status:', authStatus);
    }
  }

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
    console.log("Failed", "No token received",fcmToken);
    //  Alert.alert("Your Firebase Token is:", fcmToken);
     setToken(fcmToken)
    } else {
     console.log("Failed", "No token received");
    }
  }

  const checkFormValidations = () => {
    const isEmailValid =  Validator.isValidField(email, ST_REGEX.Email)
    const isPassValid =  Validator.isValidField(pass, ST_REGEX.Password)
    let isValidForm = true;
    if (!isEmailValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter a valid email.' );
    }else if (!isPassValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter a valid password.' );
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
        <Header/>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}>
        <Heading value="LET'S LOG IN" marginTop={50} />
        <Heading
          fontSize={16}
          marginTop={45}
          color={Colors.BLACK}
          value="IF YOU HAVE ALREADY REGISTERED, WELCOME BACK"
        />
        <SKInput
          marginTop={48}
          marginBottom={0}
          leftAccImage={CustomFonts.Email}
          maxLength = {30}
          borderColor={Colors.CLR_0065FF}
          value={email}
          keyboardType={"email-address"}
          placeholder = 'Email'
          autoCapitalize = 'none'
          onEndEditing={value => {
            setemail(value)
          }}
        />
        
        <SKInput
          leftAccImage={CustomFonts.Lock}
          marginBottom={2}
          maxLength = {16}
          borderColor={Colors.CLR_0065FF}
          value={pass}
          isSecurePass = {isSecurePass}
          autoCapitalize = 'none'
          placeholder = 'Password'
          rightAccImage={isSecurePass ? CustomFonts.EyeOutlineOff : CustomFonts.EyeOutlineOn}
          onRightPressed = {()=>{
            setIsSecurePass(!isSecurePass)
          }}
          onEndEditing={value => {
            setPass(value)
          }}
        />
        <Link
          marginTop={19}
          title="Forgot password ?"
          onPress={() => {
            navigation.navigate('ForgotPasswordNew', {pagetitle:'FORGOT PASSWORD?', pagesubs:'WE HAVE SENT A SECURITY CODE TO YOUR PHONE. PLEASE ENTER BELOW:', preScreen:undefined})
          }}
        />
        <SKButton
          fontSize={16}
          marginTop={15}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Submit'}
          onPress={() => {
            Keyboard.dismiss()
            if(checkFormValidations()){
              const params = {Email:email, Password:pass}
              setIsLoading(true)
              login(params, (userRes) =>{
                setIsLoading(false)
                if(userRes?.status == 1){
                  const user = userRes && userRes.data[0]
                  const {user_id} = user
                  const devparams  = {user_id:user_id,Device_Id:token,Device_OS:Platform.OS == 'ios' ? 'iOS' : 'Android'}
                  updateDeviceIDAndOS(devparams, (deres) =>{
                  })
                  SKTStorage.storeUserData(user, (savedRes) =>{
                    global.userInfo = savedRes
                    setTimeout(() => {
                      DeviceEventEmitter.emit('user_loggedin',true)
                    }, 200);
                  });
                }else{
                  const msg = userRes?.message ?? 'Something went wront, Please try again later.'
                  Alert.alert('SukhTax',msg)
                }
              })
            }
          }}
        />
        <Link
          marginTop={69}
          title="Don't have An Account ? Register Here"
          disable={true}
          alignment="center"
        />
        <SKButton
          fontSize={16}
          marginTop={13}
          fontWeight={'normal'}
          backgroundColor={Colors.SECONDARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'Register'}
          onPress={() => {
            navigation.navigate('Instructions')
            }}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const Header = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? 44 : 10,
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
        onPress={() => {
          props.onLeftPress && props.onLeftPress();
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 38,
            height: 38,
          }}
          source={CustomFonts.header_logo}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Login;
