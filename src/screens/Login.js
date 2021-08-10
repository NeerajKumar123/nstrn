import React, {useState} from 'react';
import {TouchableOpacity, View, Alert, ScrollView, Image,DeviceEventEmitter, Keyboard,Platform} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {login} from '../apihelper/Api'
import * as SKTStorage from '../helpers/SKTStorage'
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs'
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues'
const Login = props => {
  const navigation = useNavigation();
  // const [email, setemail] = useState('neerajkiet@gmail.com')
  // const [pass, setPass] = useState('990099')
  const [email, setemail] = useState('')
  const [pass, setPass] = useState('')
  const [isSecurePass, setIsSecurePass] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    const isEmailValid =  Validator.isValidField(email, ST_REGEX.Email)
    const isPassValid =  Validator.isValidField(pass, ST_REGEX.Password)
    let isValidForm = true;
    if (!isEmailValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid email.' );
    }else if (!isPassValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid password.' );
    }
    return isValidForm;
  };
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      {isLoading && <SKLoader/>}
      <Header />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          flex: 1,
       }}>
             
        <Heading value="LETS LOG IN" marginTop={50} />
        <Heading
          fontSize={16}
          marginTop={45}
          color={Colors.BLACK}
          value="IF YOU ALREADY HAVE REGISTERED,WELCOME BACK"
        />
        <SKInput
          marginTop={48}
          marginBottom={0}
          leftAccImage={CustomFonts.Email}
          maxLength = {30}
          borderColor={Colors.CLR_0065FF}
          value={email}
          placeholder = 'Email'
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
          title="Forgot Password ?"
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('ForgotPassword', {pagetitle:'FORGOT PASSWORD?', pagesubs:'WE HAVE SENT A SECURITY CODE TO YOUR PHONE. PLEASE ENTER BELOW:', preScreen:undefined})
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
                  SKTStorage.storeUserData(user, (savedRes) =>{
                    global.userInfo = savedRes
                    DeviceEventEmitter.emit('user_loggedin',true)
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
          title="Dont have An Account ? Register Here"
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
