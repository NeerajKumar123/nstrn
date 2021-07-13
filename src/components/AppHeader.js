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
const acc_icon = require('../../assets/account_icon.png');

const AppHeader = props => {
  const {onLeftClicked  = undefined, onRightClicked = undefined, navigation = undefined} = props;
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
          backgroundColor: 'white',
          paddingVertical: 5,
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            onPress={() => {
              onLeftClicked ? onLeftClicked() : navigation.goBack()
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
          <TouchableOpacity
          onPress={() => {
            onRightClicked ? onRightClicked() :navigation.popToTop && navigation.popToTop()
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

export const DashHeader = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? 34 : 10,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        // paddingVertical: 5,
        justifyContent: 'space-between',
        height:50
      }}>
      <Image
        resizeMode="contain"
        style={{
          width: 38,
          height: 38,
        }}
        source={header_logo}
      />
      <TouchableOpacity
        onPress={() => {
          props.onRightClicked && props.onRightClicked();
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 38,
            height: 38,
          }}
          source={acc_icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
