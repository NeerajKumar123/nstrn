import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const messeges = require('../../assets/messeges.png');
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const Identification = props => {
  const navigation = useNavigation();
  const options = {
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
  };
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading
          fontSize={23}
          value="UPLOAD YOUR IDENTIFICATION"
          marginTop={30}
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="WE NEED TO VERIFY THAT IT'S REALLY YOU!"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="PLEASE UPLOAD ONE OF THE FOLLOWING:"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="- DRIVING LICENCE"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="- PASSPORT"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="-PROVINCIAL ID CARD"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="- CITIZENSHIP CARD"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="- PR CARD"
        />
        <UploadView
          grads={[Colors.CLR_D9272A, Colors.CLR_D72528]}
          title="UPLOAD"
          onClicked={() => {
            console.log('onClicked');
            launchImageLibrary(options, res => {
              if (res?.didCancel) {
                console.log('didCancel');
              }
              if (res?.error) {
                console.log('error', res?.error ?? ERROR_MSG);
              }
            });
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BASIC INFO'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('BasicInfo');
          }}
        />
      </ScrollView>
    </View>
  );
};

const UploadView = props => {
  return (
    <LinearGradient
      colors={props.grads}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 44,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Image
          resizeMode="contain"
          style={{width: 20, height: 20}}
          source={messeges}
        />
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '700',
            marginTop: 5,
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Identification;