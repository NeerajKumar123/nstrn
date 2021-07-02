import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import TouchableEffectView from '../components/TouchableEffectView';
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
    title = 'Button title',
    disable = false,
    borderColor,
    leftImage,
    rightImage,
    marginTop = 0,
    width = '100%',
  } = props;
  return (
    <TouchableEffectView
      disabled={disable}
      foreground={foreground}
      useForeground={true}
      style={{
        backgroundColor: backgroundColor,
        height: props.height ? props.height : height,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        height,
        borderColor,
        borderWidth: 2,
        marginTop,
        width: width,
      }}
      onPress={() => {
        props.onPress && props.onPress();
      }}>
      <View style = {{width:'100%', flexDirection:'row', justifyContent:'center', height:'100%', alignItems:'center'}}>
      {leftImage && (
          <Image
            resizeMode="contain"
            style={{width: 15, height: 15, position:'absolute', left:10}}
            source={leftImage}
          />
        )}
        {title && (
          <Text
            style={{
              fontSize: fontSize,
              fontWeight: fontWeight,
              color: titleColor,
              opacity: disable ? 0.5 : 1.0,
              textAlign: 'center',
              marginLeft:leftImage ? 20 : 0,
              marginRight : rightImage ? 20 : 0
            }}>
            {title}
          </Text>
        )}
        {rightImage && (
          <Image
            resizeMode="contain"
            style={{width: 15, height: 15, position:'absolute', right:10}}
            source={rightImage}
          />
        )}
        </View>
        
    </TouchableEffectView>
  );
};

export const Link = props => {
  const {
    fontSize = 12,
    titleColor = Colors.BLACK,
    fontWeight = '700',
    title = 'Link title',
    disable = false,
    alignment = 'right',
    marginTop = 0,
  } = props;
  return (
    <TouchableOpacity
      disabled={disable}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop,
      }}
      onPress={() => {
        props.onPress && props.onPress();
      }}>
      {title && (
        <Text
          style={{
            width: '100%',
            textAlign: alignment,
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: titleColor,
          }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SKButton;
