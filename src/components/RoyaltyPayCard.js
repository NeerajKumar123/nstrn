import React from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const RoyaltyPayCard = props => {
  const {
    amount,
    date
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
      <Text style={{color:Colors.CLR_232326, textAlign:'left',fontSize: 13,fontWeight:"400", opacity:.9}}>{date}</Text>
      <Text style={{color:Colors.CLR_232326,textAlign:'right',fontSize: 15,fontWeight:"400",opacity:.9,marginRight:2}}>{`$ ${amount}`}</Text>
    </View>
  );
};

export default RoyaltyPayCard;