import React from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const RoyaltyPayCard = props => {
  const {
    name = 'Name',
    payment = "online",
    amount      = "$5",
    date   = "dec 1"
  } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        alignItems: 'center',
        width : "100%",
        height: 36
      }}
      >
      <Text style={{color:'Colors.CLR_232326', textAlign:'left',fontSize: 13,fontWeight:"400"}}>{name}</Text>
      <Text style={{color:'Colors.CLR_232326',textAlign:'center',fontSize: 15,fontWeight:"400"}}>{payment}</Text>
      <Text style={{color:'Colors.CLR_232326',textAlign:'center',fontSize: 15,fontWeight:"400"}}>{amount}</Text>
      <Text style={{color:'Colors.CLR_232326',textAlign:'center',fontSize: 15,fontWeight:"400"}}>{date}</Text>

    </View>
  );
};

export default RoyaltyPayCard;