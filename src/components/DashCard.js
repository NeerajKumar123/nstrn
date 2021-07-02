import React from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
const {width} = Dimensions.get('window');
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
const DashCard = props => {
  const {id, name, desc, image, colors} = props.item;
  return (
    <TouchableOpacity
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <LinearGradient
        colors={colors}
        style={{
          borderRadius: 6,
          width: 163,
          height: 185,
          backgroundColor: 'white',
          margin: 7,
          alignItems: 'center',
          paddingHorizontal: 7,
          paddingVertical: 8,
          opacity:.6
        }}>
        <Text
          style={{
            fontWeight: '700',
            color: Colors.WHITE,
            fontSize: 17,
            textAlign: 'center',
            minHeight: 48,
          }}>
          {name}
        </Text>
        <Image
          resizeMode="contain"
          style={{width: 33, height: 33, alignSelf: 'center'}}
          source={image}
        />
        <Text
          style={{
            marginTop: 20,
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 15,
          }}>
          {desc}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default DashCard;
