import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  DeviceEventEmitter,
  Keyboard,
  Platform,
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {login} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import AppHeader from '../components/AppHeader';
const emailicon = require('../../assets/email.png');
const header_logo = require('../../assets/header_logo.png');
const passicon = require('../../assets/pass.png');
const CarryForward = props => {
  const navigation = useNavigation();
  const [email, setemail] = useState('neerajkiet@gmail.com');
  const [pass, setPass] = useState('990099');
  const [isLoading, setIsLoading] = useState(false);

  const checkFormValidations = () => {
    let isValidForm = true;
    if (email == undefined || email.length < 10) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid email.');
    } else if (pass == undefined || pass.length < 6) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid password.');
    }
    return isValidForm;
  };
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="CARRY FORWARD" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.CLR_D9272A}
          value="WE SEE THAT YOU FILED
          YOUR RETURN THROUGH
          THE APP LAST. WOULD YOU
          LIKE TO PRE-POPULATE
          YOUR RETURN?"
        />
        <Heading
          fontSize={16}
          marginTop={30}
          color={Colors.CLR_D9272A}
          value="DON'T WORRY, YOU'LL
          HAVE A CHANCE TO EDIT THE
          DETAILS THAT HAVE
          CHANGED"
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.CLR_7F7F9F}
            borderColor={Colors.CLR_D3D3D9}
            title={'NO'}
            onPress={() => {
              console.log('onPress');
              navigation.navigate('Identification');
            }}
          />
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'YES'}
            onPress={() => {
              console.log('onPress');
              navigation.navigate('Identification');
            }}
          />
        </View>
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

export default CarryForward;
