import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import * as Colors from '../constants/ColorDefs';

const Heading = props => {
  const {
    color = Colors.CLR_29295F,
    fontSize = 25,
    fontWeight = '700',
    value = 'Heading',
    marginTop = 0,
    marginHorizontal = 0,
    marginBottom = 0,
  } = props;
  return (
    <View style = {{marginHorizontal,marginBottom,marginTop}}>
      <Text style = {{color,fontSize, fontWeight}}>{value}</Text>
    </View>
  );
};


export default Heading