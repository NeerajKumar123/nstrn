import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from './Heading';
import AppHeader from './AppHeader';
import SKButton from './SKButton';
import SKLoader from './SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {getRefrralPrice} from '../apihelper/Api';
import React, {useState, useEffect} from 'react';
const Vector9 = require('../../assets/tab/Vector 9.png');
const Vector10 = require('../../assets/tab/Vector 10.png');
const TilesCard = props => {
  const {title, desc, desc1, marginTop = 0, backgroundColor} = props;
  return (
    <View
      style={{
        flexDirection: 'column',
        paddingVertical: 15,
        borderRadius: 5,
        elevation:3,
        borderColor: Colors.GREEN,
        alignItems: 'center',
        paddingHorizontal: 5,
        shadowColor: Colors.CLR_E3BDBE,
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowRadius: 2,
        shadowOpacity: 0.9,
        marginTop,
        backgroundColor:backgroundColor
      }}>
      <Text
        style={{
          color: Colors.WHITE,
          fontSize: 16,
          width:'90%',
          fontWeight: '600',
          textAlign: 'left'
        }}>
        {title}
      </Text>
      <View
        style={{
          backgroundColor: Colors.WHITE,
          height: 1,
          width: '100%',
          marginTop: 11,
        }}
      />
      <Text
        style={{
          color: Colors.WHITE,
          fontSize: 14,
          fontWeight: '500',
          textAlign: 'center',
          marginTop: 10,
        }}>
        {desc}
      </Text>
      <Text
        style={{
          color: Colors.WHITE,
          fontSize: 14,
          fontWeight: '500',
          marginTop: 10,
          textAlign: 'center',
          width: '90%',
          letterSpacing:-.5
        }}>
        {desc1}
      </Text>
    </View>
  );
};

export default TilesCard;
