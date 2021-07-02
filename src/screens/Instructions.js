import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
const right_arrow = require('../../assets/right_arrow.png');
const header_logo = require('../../assets/header_logo.png');

const Instructions = props => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        flex: 1,
        width: '100%',
      }}>
      <View style={{marginTop: 81}}>
        <Image
          resizeMode="contain"
          style={{width: 136, height: 150}}
          source={header_logo}
        />
      </View>
      <View style={{marginTop: 47}}>
        <Heading
          fontWeight="700"
          fontSize={25}
          value="NEW PASSWORD"
          marginTop={0}
        />
        <Heading
          fontWeight="700"
          fontSize={22}
          value="DONT WORRY WE HAVE GOT YOU COVERED."
          marginTop={30}
        />
        <Heading
          fontWeight="700"
          fontSize={22}
          value="PLEASE HIT THE NEXT BUTTON TO START WITH SOME BASICINFORMATION"
          marginTop={38}
        />
      </View>
      <TouchableOpacity
      onPress = {() =>{
        navigation.navigate('SignUp')
      }}
        style={{
          backgroundColor: Colors.CLR_D9272A,
          borderRadius: 28,
          width: 56,
          height: 56,
          borderWidth: 2,
          borderColor: Colors.CLR_F47F7F,
          justifyContent: 'center',
          alignItems: 'center',
          position:'absolute',
          right:10,
          bottom:10
        }}>
        <Image
          resizeMode="contain"
          style={{width: 12, height: 25}}
          source={right_arrow}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Instructions;
