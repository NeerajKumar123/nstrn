import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';

const SKSwitch = props => {
  const {
    fontSize = 25,
    fontWeight = '700',
    value = 'Heading',
    marginTop = 0,
    marginHorizontal = 0,
    marginBottom = 0,
    fontFamily = CustomFonts.OpenSansRegular,
    textAlign = 'left',
    onToggle = undefined,
    color = Colors.APP_BLUE_HEADING_COLOR,
    isOn = false,
  } = props;

  return (
    <View
      style={{
        marginHorizontal,
        marginBottom,
        marginTop,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        padding: 2,
        width: '100%',
      }}>
      <Text style={{color, fontSize, fontWeight, fontFamily, textAlign, flex:1}}>
        {value}
      </Text>
      <TouchableOpacity
       onPress={() => {
        onToggle && onToggle();
      }}
      >
      <Image
          resizeMode="contain"
          style={{width: 50, height: 35}}
          source={isOn ? CustomFonts.toggle_on : CustomFonts.toggle_off}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SKSwitch;
