import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const SKInput = props => {
  const {value, onFocused,isSecurePass,onRightPressed} = props;
  const [initialValue, setInitialValue] = useState(value);
  const [isSecure, setIsSecure] = useState(isSecurePass)
  useEffect(() => {
    setInitialValue(value);
  }, [value]);
  useEffect(() => {
    setIsSecure(isSecurePass);
  }, [isSecurePass]);
  const {
    leftAccImage ,
    rightAccImage ,
    marginTop = 10,
    marginBottom = 10,
    height,
    placeholder = 'Enter value',
    maxLength = 30,
    isChatInput = false,
    multiline,
    keyboardType = 'default',
    autoCapitalize = 'none',
    returnKeyType ,
    blurOnSubmit
  } = props;
  const isLeftLocalPNG = leftAccImage && typeof leftAccImage == 'number';
  const isRightLocalPNG = rightAccImage && typeof rightAccImage == 'number';
  return (
    <View
      style={{
        width: '100%',
        height: height ? height + 2 :  57,
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
        marginTop,
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
        style={{
          fontSize: 18,
          fontFamily: CustomFonts.OpenSansRegular,
          fontWeight: props.fontSize ? props.fontSize : '400',
          height: height ? height :  56,
          flex: 1,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : Colors.WHITE,
        }}
        textAlign={props.textAlign ? props.textAlign : 'left'}
        underlineColorAndroid="transparent"
        value={initialValue}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry = {isSecure}
        autoCapitalize={autoCapitalize}
        autoCompleteType="off"
        autoCorrect={false}
        placeholderTextColor = {Colors.LIGHTGRAY}
        placeholder={placeholder}
        maxLength={maxLength}
        returnKeyType = {returnKeyType}
        blurOnSubmit = {blurOnSubmit}
        onFocus={() => {
          onFocused && onFocused();
        }}
        onChangeText={value => {
          setInitialValue(value);
          props.onTextChange && props.onTextChange(value);
        }}
        onBlur = {() =>{
          console.log('onBlur')
        }}
        onEndEditing={() => {
          const finalValue  = initialValue ? initialValue.trim() : ''
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
            backgroundColor: isChatInput ? 'blue' : Colors.TRANS,
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

const styles = StyleSheet.create({
  textInputUnderLined: {
    fontSize: 16,
    height: 30,
    fontSize: 16,
    width: '60%',
  },
  lottie: {
    width: 40,
    height: 40,
  },
});
