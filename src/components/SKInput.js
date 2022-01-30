/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, TextInput, Image, TouchableOpacity} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const SKInput = props => {
  const {value, onFocused, isSecurePass, onRightPressed} = props;
  const [initialValue, setInitialValue] = useState(value);
  const [isSecure, setIsSecure] = useState(isSecurePass);
  useEffect(() => {
    setInitialValue(value);
  }, [value]);
  useEffect(() => {
    setIsSecure(isSecurePass);
  }, [isSecurePass]);
  const {
    leftAccImage,
    rightAccImage,
    marginTop = 15,
    marginBottom = 10,
    height,
    placeholder = 'Enter value',
    maxLength = 30,
    isChatInput = false,
    multiline = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    returnKeyType,
    blurOnSubmit,
    textAlign = 'left',
    fontSize = 17,
    fontWeight = '400',
    editable = true,
  } = props;
  const isLeftLocalPNG = leftAccImage && typeof leftAccImage === 'number';
  const isRightLocalPNG = rightAccImage && typeof rightAccImage === 'number';
  return (
    <View
      style={{
        width: '100%',
        height: height ? height + 2 : 57,
        padding: 3,
        paddingHorizontal: 20,
        borderColor: props.borderColor ? props.borderColor : Colors.GRAY,
        borderRadius: height ? 8 : 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : Colors.WHITE,
        shadowColor: Colors.LIGHTGRAY,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.8,
        marginTop: marginTop,
        marginBottom,
      }}>
      {leftAccImage && isLeftLocalPNG && (
        <Image
          source={leftAccImage}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            marginRight: 21,
          }}
        />
      )}
      {leftAccImage && !isLeftLocalPNG && (
        <Icon
          style={{marginRight: 21}}
          name={leftAccImage}
          size={25}
          color={Colors.LIGHTGRAY}
        />
      )}
      <TextInput
        editable={editable}
        style={{
          fontSize: fontSize,
          fontFamily: CustomFonts.OpenSansRegular,
          fontWeight: fontWeight,
          height: height ? height : 56,
          flex: 1,
          color: editable === false ? Colors.CLR_9B9EA1 : Colors.BLACK,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : Colors.WHITE,
        }}
        textAlign={textAlign}
        underlineColorAndroid="transparent"
        value={initialValue}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={isSecure}
        autoCapitalize={autoCapitalize}
        autoCompleteType="off"
        autoCorrect={false}
        placeholderTextColor={Colors.CLR_9B9EA1}
        placeholder={placeholder}
        maxLength={maxLength}
        returnKeyType={returnKeyType}
        blurOnSubmit={blurOnSubmit}
        onFocus={() => {
          onFocused && onFocused();
        }}
        onChangeText={value1 => {
          setInitialValue(value1);
          props.onTextChange && props.onTextChange(value1);
        }}
        onBlur={() => {}}
        onEndEditing={() => {
          const finalValue = initialValue ? initialValue.trim() : '';
          props.onEndEditing && props.onEndEditing(finalValue);
        }}
      />
      {rightAccImage && (
        <TouchableOpacity
          style={{
            height: 40,
            width: isChatInput ? 40 : 40,
            justifyContent: 'center',
            alignItems: isChatInput ? 'center' : 'flex-end',
            backgroundColor: isChatInput
              ? Colors.APP_RED_SUBHEADING_COLOR
              : Colors.TRANS,
            borderRadius: isChatInput ? 6 : 0,
          }}
          onPress={() => {
            onRightPressed && onRightPressed();
          }}>
          {isRightLocalPNG && (
            <Image
              source={rightAccImage}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
              }}
            />
          )}
          {!isRightLocalPNG && (
            <Icon name={rightAccImage} size={25} color={Colors.LIGHTGRAY} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SKInput;
