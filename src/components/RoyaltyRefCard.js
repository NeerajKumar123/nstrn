import React from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const RoyaltyRefCard = props => {
  const {
    color = Colors.BLACK,
    fontSize = 19,
    fontWeight = "normal",
    name = 'JAMIE SMITH',
    payment = "online",
    amount      = "$5",
    marginTop = 0,
    marginHorizontal = 20,
    marginBottom = 0,
    status = 0,
    fontFamily = CustomFonts.OpenSansRegular,
    textAlign = 'left',
    onClicked = undefined,
    textWidth = undefined
  } = props;
  console.log('======>', props)
  return (
    <View
      style={{
       
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 2,
        alignItems: 'center',
        width : "100%"
      
       
      }}
      >
      <Text style={{ color, fontSize, fontWeight, fontFamily, textAlign, width: textWidth && textWidth }}>{name}</Text>
      <Text style={{ color, fontSize, fontWeight, fontFamily, textAlign, width: textWidth && textWidth }}>{payment}</Text>
      <Text style={{ color, fontSize, fontWeight, fontFamily, textAlign, width: textWidth && textWidth }}>{amount}</Text>

    </View>
  );
};

export default RoyaltyRefCard;
