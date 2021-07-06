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
const  emailicon = require('../../assets/email.png');
const header_logo = require('../../assets/header_logo.png');
const passicon = require('../../assets/pass.png');
const Login = props => {
  const navigation = useNavigation();
  const [email, setemail] = useState('neerajkiet@gmail.com')
  const [pass, setPass] = useState('990099')
  const [isLoading, setIsLoading] = useState(false)

  const checkFormValidations = () => {
    let isValidForm = true;
    if (email == undefined || email.length < 10) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid email.' );
    }else if (pass == undefined || pass.length < 6) {
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
        <Heading value="LETS LOG IN" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.BLACK}
          value="IF YOU ALREADY HAVE REGISTERED,WELCOME BACK"
        />
        <SKInput
          marginTop={48}
          marginBottom={0}
          leftAccImage={emailicon}
          maxLength = {30}
          borderColor={Colors.CLR_0065FF}
          value={email}
          placeholder = 'Email'
          onEndEditing={value => {
            setemail(value)
          }}
        />
        <SKInput
          leftAccImage={passicon}
          marginBottom={0}
          maxLength = {10}
          borderColor={Colors.CLR_0065FF}
          value={pass}
          placeholder = 'Password'
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
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
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
          backgroundColor={Colors.CLR_F58080}
          borderColor={Colors.CLR_EB0000}
          title={'Register'}
          onPress={() => {
            console.log('onPress');
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
          source={header_logo}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Login;
