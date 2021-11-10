import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
} from 'react-native';
import * as CustomFonts from '../constants/FontsDefs'

const Splash = props => {
    useEffect(() => {
        var navigator = props.navigator;
        setTimeout (() => {
            navigator.replace({
                id: 'Dashboard',
            });
        }, 2000); 

    }, [])

        return (
            <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
               <Image
              source={CustomFonts.header_logo}
              resizeMode="contain"
              style={{
                  flex:1
              }}
            />
            </View>
        );
}

export default Splash

