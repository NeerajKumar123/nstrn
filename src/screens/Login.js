import React, {useState} from 'react';
import {TouchableOpacity, View, Alert, ScrollView, Image} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
const user = require('../../assets/user.png');
const header_logo = require('../../assets/header_logo.png');

const Login = props => {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState('')
  const [pass, setPass] = useState('')

  const checkFormValidations = () => {
    let isValidForm = true;
    if (mobile == undefined || mobile.length < 10) {
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid mobile number.' );
    }else if (pass == undefined || pass.length < 6) {
      isValidForm = false;
      Alert.alert('AppDisplayName','Please enter valid password.' );
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
          leftAccImage={user}
          borderColor={Colors.CLR_0065FF}
          value={mobile}
          placeholder = 'Mobile Number'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setMobile(value)
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          rightAccImage={user}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={pass}
          placeholder = 'Password'
          onEndEditing={value => {
            console.log('onEndEditing', value);
            setPass(value)
          }}
        />
        <Link
          marginTop={19}
          title="Forgot Password ?"
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('ForgotPassword')
          }}
        />
        <SKButton
          fontSize={16}
          marginTop={15}
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
          title={'Continue'}
          onPress={() => {
            if(checkFormValidations()){
              console.log('All Okay', mobile, pass);
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
            navigation.navigate('SignUp')
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
