import { TouchableOpacity, View, Image, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Heading from './Heading';
import AppHeader from './AppHeader';
import SKButton from './SKButton';
import SKLoader from './SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import { getRefrralPrice } from '../apihelper/Api'
import React, { useState, useEffect } from 'react';
import { TextAlignment } from 'pdf-lib';
const Vector9 = require('../../assets/tab/Vector 9.png');
const Vector10 = require('../../assets/tab/Vector 10.png');
const TilesCard = props => {
    const { title, desc, image} = props;
    return (
        <View
        style={{
          flexDirection: 'column',
          width: 144,
          backgroundColor: 'grey',
          height: 209,
            borderRadius: 26,
            marginTop: 5,
            marginHorizontal:5

        }}>
        <Text
          style={{
            color: Colors.APP_BLUE_HEADING_COLOR,
            fontSize: 17,
            fontWeight: '700',
            marginTop:24,
            marginHorizontal: 10,
            alignContent: 'stretch',
            TextAlignment: 'center'
          }}>
          {title}
        </Text>
        <Image
          resizeMode='stretch'
          style={{width: "100%" ,height:10,color:"black"}}
          source={Vector9}
        />
         <Text
          style={{
            color: Colors.APP_RED_SUBHEADING_COLOR,
            fontSize: 14,
            fontWeight: '500',
            paddingTop:20,
            marginHorizontal: 17
          }}>
          {desc}
        </Text>
      </View>
    );
};

export default TilesCard;

