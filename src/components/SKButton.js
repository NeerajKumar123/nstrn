import React from 'react';
import {Text, TouchableOpacity,Image,TouchableNativeFeedback} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import TouchableEffectView  from '../components/TouchableEffectView'
const SKButton = props => {
  let foreground = null;
  if (Platform.OS === 'android' && Platform.Version > 20) {
    foreground = TouchableNativeFeedback.Ripple(colors.black_op15, true);
  }

  const {
    iconName = undefined,
    imageSource = undefined,
    backgroundColor = Colors.RED,
    height = 40,
    iconsize = 20,
    iconcolor = Colors.WHITE,
    fontSize = 15,
    titleColor = Colors.WHITE,
    fontWeight = '700',
    title= 'Button title',
    disable = false,
    borderColor,
    leftImage,
    marginTop = 0
  } = props;
  return (
    <TouchableEffectView
      disabled = {disable}
      foreground={foreground}
      useForeground  = {true}
      style={{
        backgroundColor: backgroundColor,
        height: props.height ? props.height : height,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        height,
        borderColor,
        borderWidth:2,
        marginTop,
      }}
      onPress={() => {
        console.log('TouchableEffectView')
        props.onPress && props.onPress();
      }}>
        <>
        {leftImage && 
        <Image
        resizeMode="contain"
        style={{width: 15, height: 15, marginRight: 5}}
        source={leftImage}
      />
        }
      {title && (
        <Text
          style={{
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: titleColor,
            opacity: disable ? .5 : 1.0
          }}>
          {title}
        </Text>
      )}
      </>
    </TouchableEffectView>
  );
};

export const Link = (props) =>{

  const {
    fontSize = 12,
    titleColor = Colors.BLACK,
    fontWeight = '700',
    title= 'Link title',
    disable = false,
    alignment = 'right',
    marginTop = 0
  } = props;
  return (
    <TouchableOpacity
      disabled = {disable}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop
      }}
      onPress={() => {
        props.onPress && props.onPress();
      }}>
       
      {title && (
        <Text
          style={{
            width:'100%',
            textAlign:alignment,
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: titleColor,
          }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );

}

export default SKButton;
