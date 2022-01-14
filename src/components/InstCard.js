import { TouchableOpacity, View, Image, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import { getRefrralPrice } from '../apihelper/Api'
import React, { useState, useEffect } from 'react';
const ins1 = require('../../assets/tab/ins1.png');
const ins2 = require('../../assets/tab/ins2.png');
const ins3 = require('../../assets/tab/ins3.png');
const InstCard = props => {
    const { image, text, margin = 0,padding = 0 } = props;
    return (
        <View
            style={{
                width: '100%',
                backgroundColor: Colors.WHITE,
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    backgroundColor: "white"

                }}>
                
                    <Image
                    resizeMode="contain"
                    style={{ width: 72, height: 50 }}
                    source={ins3}
                />
                <Text
                    style={{
                        color: Colors.CLR_29295F,
                        fontSize: 18,
                        fontWeight: '400',
                    }}>
                    {text}
                </Text>
                
            </View>
           
           
        </View>
    );
};

export default InstCard;

