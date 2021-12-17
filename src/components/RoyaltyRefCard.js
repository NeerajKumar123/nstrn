import React from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const RoyaltyRefCard = props => {
  const {
    name = 'JAMIE SMITH',
    payment = "online",
    amount      = "$5",
  } = props;
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
      <Text style={{color:'black', textAlign:'left'}}>{name}</Text>
      <Text style={{color:'black',textAlign:'center'}}>{payment}</Text>
      <Text style={{color:'black',textAlign:'center'}}>{amount}</Text>
     
    </View>
  );
};

export default RoyaltyRefCard;