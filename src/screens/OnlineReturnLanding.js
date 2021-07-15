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
  Text
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const OnlineReturnLanding = props => {
  const data = [{year:'2018'},{year:'2018'},{year:'2018'}]
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
        <Heading value="NEW ONLINE RETURN" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.CLR_D9272A}
          value="WHICH YEARS DO YOU WANT
          TO APPLY FOR? SELECT ALL
          THAT APPLY:"          
        />
        {data &&
        data.map((item, index) => {
          return (
            <DocCard
              item={item}
              onSelected={() => {
                  console.log('data',item)
              }}
            />
          );
        })}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24
          }}>
          <SKButton
            fontSize={16}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'IDENTIFICATION'}
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

const DocCard = props => {
    const {item} = props
    return (
        <TouchableOpacity
           style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginTop: 20,
            backgroundColor: 'white',
            alignItems:'center',
            justifyContent: 'center',
            width: '100%',
            height: 48,
            borderRadius:6,
            backgroundColor:Colors.CLR_7F7F9F
          }}
          key = {`${Math.random()}`}
          onPress={() => {
            props.onClicked && props.onClicked();
          }}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              color: Colors.WHITE,
              fontSize: 17,
              fontWeight: '700',
            }}>
            {item.year}
          </Text>
        </TouchableOpacity>
    );
  };


export default OnlineReturnLanding;
