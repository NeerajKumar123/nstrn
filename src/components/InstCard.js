import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {getRefrralPrice} from '../apihelper/Api';
import React, {useState, useEffect} from 'react';
const ins1 = require('../../assets/tab/ins1.png');
const ins2 = require('../../assets/tab/ins2.png');
const ins3 = require('../../assets/tab/ins3.png');
const InstCard = props => {
  const {image, text, margin = 0, padding = 0} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
      }}>
      <Image
        resizeMode="contain"
        style={{width: 45, height: 45}}
        source={image}
      />
      <Text
        style={{
          color: Colors.CLR_29295F,
          fontSize: 16,
          fontWeight: '400',
          marginLeft: 20,
          flex:1,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default InstCard;
