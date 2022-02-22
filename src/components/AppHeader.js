import React from 'react';
import {
  Platform,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import * as CustomFonts from '../constants/FontsDefs'
const AppHeader = props => {
  const {onLeftClicked  = undefined, onRightClicked = undefined, navigation = undefined} = props;
  return (
    <>
      <StatusBar/>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 16,
          backgroundColor: 'white',
          paddingVertical: 5,
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            style = {{justifyContent:'flex-start', alignItems:'flex-start',width:40}}
            onPress={() => {
              onLeftClicked ? onLeftClicked() : navigation.goBack()
            }}>
            <Image
              source={CustomFonts.back}
              resizeMode="contain"
              style={{
                width: 19,
                height: 27,
                marginLeft:3,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => {
            onRightClicked ? onRightClicked() :navigation.popToTop && navigation.popToTop()
          }}>
          <Image
            source={CustomFonts.header_logo}
            resizeMode="contain"
            style={{
              width: 40,
              height: 40,
            }}
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
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        height:50
      }}>
      <Image
        source={CustomFonts.header_logo}
        resizeMode="contain"
        style={{
          width: 38,
          height: 38,
        }}
      />
      <TouchableOpacity
        onPress={() => {
          props.onRightClicked && props.onRightClicked();
        }}>
        <Image
          source={CustomFonts.account_icon}
          resizeMode="contain"
          style={{
            width: 38,
            height: 38,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
