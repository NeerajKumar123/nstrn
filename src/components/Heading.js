import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const green_tick = require('../../assets/green_tick.png');
const status_gray = require('../../assets/status_gray.png');

const Heading = props => {
  const {
    color = Colors.CLR_29295F,
    fontSize = 25,
    fontWeight = '700',
    value = 'Heading',
    marginTop = 0,
    marginHorizontal = 0,
    marginBottom = 0,
    status = 0,
    fontFamily = CustomFonts.OpenSansRegular,
    textAlign = 'left',
    onClicked = undefined
  } = props;
  return (
    <TouchableOpacity
      disabled = {!onClicked}
      style={{
        marginHorizontal,
        marginBottom,
        marginTop,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding:2,
        width:'100%'
      }}
      onPress = {()=>{
        onClicked && onClicked()
      }}>
      <Text style={{color, fontSize, fontWeight,fontFamily,textAlign}}>{value}</Text>
      {status ? (
        <Image
          resizeMode="contain"
          style={{width: 20, height: 20}}
          source={status == 2 ? green_tick : status_gray}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default Heading;
