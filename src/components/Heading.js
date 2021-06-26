import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import * as Colors from '../constants/ColorDefs';
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
  } = props;
  return (
    <View
      style={{
        marginHorizontal,
        marginBottom,
        marginTop,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text style={{color, fontSize, fontWeight}}>{value}</Text>
      {status ? (
        <Image
          resizeMode="contain"
          style={{width: 20, height: 20}}
          source={status == 2 ? green_tick : status_gray}
        />
      ) : null}
    </View>
  );
};

export default Heading;
