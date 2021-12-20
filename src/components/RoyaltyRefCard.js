import React from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const RoyaltyRefCard = props => {
  const {
    name = 'JAMIE SMITH',
    amount      = "$5",
    date = 'sdsdsd',
    module = 'module'
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
      <Text style={{color:Colors.CLR_232326, textAlign:'left',fontSize: 13,fontWeight:"400", opacity:.9,flex:1}}>{name}</Text>
      <Text style={{color:Colors.CLR_232326,textAlign:'center',fontSize: 13,fontWeight:"400",opacity:.9,marginRight:2,flex:1}}>{date}</Text>
      <Text style={{color:Colors.CLR_232326,textAlign:'right',fontSize: 13,fontWeight:"400",opacity:.9,marginRight:2,flex:1}}>{module}</Text>
      <Text style={{color:Colors.CLR_232326,textAlign:'right',fontSize: 13,fontWeight:"400",opacity:.9,marginRight:2,flex:.7}}>{`$ ${amount}`}</Text>
    </View>
  );
};

export default RoyaltyRefCard;