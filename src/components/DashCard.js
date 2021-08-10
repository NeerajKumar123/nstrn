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
import * as CustomFonts from '../constants/FontsDefs'
const DashCard = props => {
  const {id, name = 'Card Name', desc, image, colors} = props.item;
  const {fee} = props
  let displayDesc = name
  if(id == 3){
    displayDesc = `STARTING FROM $${fee}`
  }
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
        }}>
        <Text
          style={{
            fontWeight: '700',
            color: Colors.WHITE,
            fontSize: 17,
            textAlign: 'center',
            fontFamily:Platform.OS == 'android' ?  CustomFonts.OpenSansBold : CustomFonts.OpenSansRegular,
            fontWeight:'800',
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
            fontWeight:Platform.OS == 'android' ? 'normal' : '700',
            fontSize: 15,
            fontFamily:Platform.OS == 'android' ?  CustomFonts.OpenSansBold : CustomFonts.OpenSansRegular,
          }}>
          {displayDesc}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default DashCard;
