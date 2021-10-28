import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
  View,
  Platform,
} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import TouchableEffectView from '../components/TouchableEffectView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const SKButton = props => {
  let foreground = null;
  if (Platform.OS === 'android' && Platform.Version > 20) {
    foreground = TouchableNativeFeedback.Ripple(Colors.TRANS, true);
  }

  const {
    iconName = undefined,
    imageSource = undefined,
    backgroundColor = Colors.RED,
    height = 46,
    iconsize = 25,
    iconcolor = Colors.WHITE,
    fontSize = 15,
    titleColor = Colors.WHITE,
    fontWeight = '700',
    title = 'Button title',
    disable = false,
    borderColor,
    borderWidth = 4,
    leftImage,
    rightImage,
    marginTop = 0,
    width = '100%',
    fontFamily = CustomFonts.OpenSansRegular,
    rightIconName = undefined,
  } = props;
  const isLeftLocalPNG = leftImage && typeof leftImage == 'number';
  const isRightLocalPNG = rightImage && typeof rightImage == 'number';

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
        borderRadius: height / 2,
        height,
        borderColor,
        borderWidth: borderWidth,
        marginTop,
        width: width,
      }}
      onPress={() => {
        !disable && props.onPress && props.onPress();
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          height: '100%',
          alignItems: 'center',
        }}>
        {leftImage && isLeftLocalPNG && (
          <Image
            resizeMode="contain"
            style={{width: 15, height: 15}}
            source={leftImage}
          />
        )}
        {leftImage && !isLeftLocalPNG && (
          <Icon
            style={{marginRight: 20}}
            name={leftImage}
            size={iconsize}
            color={iconcolor}
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
              marginLeft: leftImage ? 10 : 0,
              marginRight: rightImage ? 10 : 0,
              fontFamily,
            }}>
            {title}
          </Text>
        )}
        {rightImage && isRightLocalPNG && (
          <Image
            resizeMode="contain"
            style={{width: 15, height: 15, opacity: disable ? 0.5 : 1.0}}
            source={rightImage}
          />
        )}
        {rightImage && !isRightLocalPNG && (
          <Icon
            name={rightImage}
            size={iconsize}
            color={iconcolor}
            opacity={disable ? 0.5 : 1.0}
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
    fontFamily = CustomFonts.OpenSansRegular,
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
            fontFamily,
          }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const UploadDocButton = props => {
  const {
    marginTop = 30,
    title = 'UPLOAD',
    height = 46,
    isAttach = false,
  } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={{
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: Colors.APP_BLUE_HEADING_COLOR,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderRadius: 6,
        height,
        marginTop: marginTop,
      }}>
      <Text style={{fontFamily: CustomFonts.OpenSansRegular, fontSize: 15}}>
        {title}
      </Text>
      {isAttach ? (
        <Icon
          name={'attachment'}
          size={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
        />
      ) : (
        <Image
          resizeMode="contain"
          style={{width: 24, height: 24}}
          source={CustomFonts.upload}
        />
      )}
    </TouchableOpacity>
  );
};

export const DarkBlueButton = props => {
  const {marginTop = 30, title = 'UPLOAD', height = 46} = props;
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={{
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        height,
        marginTop: marginTop,
      }}>
      <Text
        style={{
          fontFamily: CustomFonts.OpenSansRegular,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export default SKButton;
