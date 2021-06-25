import React from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
const {width} = Dimensions.get('window');
import * as Colors from '../constants/ColorDefs';
const back = require('../../assets/back.png');
const header_logo = require('../../assets/header_logo.png');

const AppHeader = props => {
  const {isLeftEnabled = true} = props
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          flexDirection: 'row',
          marginTop: Platform.OS == 'ios' ? 34 : 10,
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 16,
          backgroundColor:'white',
          paddingVertical:5,
          justifyContent:'space-between'
        }}>
          {isLeftEnabled && 
          <TouchableOpacity
          onPress={() => {
            props.onLeftPress && props.onLeftPress();
          }}>
          <Image
            resizeMode="contain"
            style={{
              width: 19,
              height: 25,
            }}
            source={back}
          />
        </TouchableOpacity>
          }
          <TouchableOpacity
          onPress={() => {
            props.onLeftPress && props.onLeftPress();
          }}>
          <Image
            resizeMode="contain"
            style={{
              width: 40,
              height: 40,
            }}
            source={header_logo}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AppHeader;
