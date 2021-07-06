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
import * as CustomFonts from '../constants/FontsDefs'
const SKInput = props => {
  const {value,onFocused} = props;
  const [initialValue, setInitialValue] = useState(value);
  useEffect(() => {
    setInitialValue(value);
  }, [value]);
  const {
    leftAccImage,
    rightAccImage,
    marginTop = 10,
    marginBottom = 10,
    placeholder = 'Enter value',
    maxLength = 30,
    isChatInput = false,
  } = props;
  return (
    <View
      style={{
        width: '100%',
        height: 57,
        padding: 3,
        paddingHorizontal: 33,
        borderColor: props.borderColor ? props.borderColor : Colors.GRAY,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation:2,
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
      {leftAccImage && (
        <Image
          resizeMode="contain"
          style={{width: 15, height: 15, marginRight: 21}}
          source={leftAccImage}
        />
      )}
      <TextInput
        style={{
          fontSize: 18,
          fontFamily:CustomFonts.OpenSansRegular,
          fontWeight: props.fontSize ? props.fontSize : '400',
          height: 56,
          flex: 1,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : Colors.WHITE,
        }}
        textAlign={props.textAlign ? props.textAlign : 'left'}
        underlineColorAndroid="transparent"
        value={initialValue}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        placeholder={props.placeholder}
        maxLength={maxLength}
        onFocus={() => {
          onFocused && onFocused()
        }}
        onChangeText={value => {
          setInitialValue(value);
          props.onTextChange && props.onTextChange(value)
        }}
        onEndEditing={() => {
          props.onEndEditing && props.onEndEditing(initialValue);
        }}
      />
      {rightAccImage && (
        <TouchableOpacity
          style={{
            height: 40,
            width: isChatInput ? 40 :  40,
            justifyContent: 'center',
            alignItems: isChatInput ? 'center' : 'flex-end',
            backgroundColor:isChatInput ? 'blue' : Colors.TRANS,
            borderRadius:isChatInput ? 6 : 0
          }}
          onPress={() => {
            props.onRightPressed && props.onRightPressed();
          }}>
          <Image
            resizeMode="contain"
            style={{width: isChatInput ?  20 : 15, height: isChatInput ?  20 : 15}}
            source={rightAccImage}
          />
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
