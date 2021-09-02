import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const Heading = props => {
  const {
    color = Colors.APP_BLUE_HEADING_COLOR,
    fontSize = 25,
    fontWeight = '700',
    value = 'Heading',
    marginTop = 0,
    marginHorizontal = 0,
    marginBottom = 0,
    status = 0,
    fontFamily = CustomFonts.OpenSansRegular,
    textAlign = 'left',
    onClicked = undefined,
    textWidth = undefined
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
      <Text style={{color, fontSize, fontWeight,fontFamily,textAlign, width:textWidth && textWidth}}>{value}</Text>
      {status ? (
        <Image
          resizeMode="contain"
          style={{width: 20, height: 20}}
          source={status > 2 ? CustomFonts.green_tick : CustomFonts.status_gray}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default Heading;
