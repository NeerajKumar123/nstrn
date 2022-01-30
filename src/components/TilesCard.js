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
import {TextAlignment} from 'pdf-lib';
const Vector9 = require('../../assets/tab/Vector 9.png');
const Vector10 = require('../../assets/tab/Vector 10.png');
const TilesCard = props => {
  const {title, desc, desc1} = props;
  return (
    <View
      style={{
        flexDirection: 'column',
        width: 144,
        backgroundColor: Colors.WHITE,
        paddingVertical: 24,
        borderRadius: 26,
        borderColor: Colors.GREEN,
        alignItems: 'center',
        paddingHorizontal: 5,
        shadowColor: Colors.CLR_E3BDBE,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 7,
        shadowOpacity: 0.9,
      }}>
      <Text
        style={{
          color: Colors.APP_BLUE_HEADING_COLOR,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        }}>
        {title}
      </Text>
      <View
        style={{
          backgroundColor: Colors.CLR_29295F,
          height: .3,
          width: '100%',
          marginTop: 11,
        }}
      />
      <Text
        style={{
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 16,
          fontWeight: '500',
          textAlign: 'center',
          marginTop: 24,
        }}>
        {desc}
      </Text>
      <Text
        style={{
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 16,
          fontWeight: '500',
          marginTop: 24,
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
