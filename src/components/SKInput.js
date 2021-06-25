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
const SKInput = props => {
  const [value, setValue] = useState(props.value);
  const {
    leftAccImage,
    rightAccImage,
    marginTop = 10,
    marginBottom = 10,
    placeholder = 'Enter value'
  } = props;
  console.log('leftAccImage', leftAccImage);
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
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : Colors.WHITE,
        shadowColor: Colors.LIGHTGRAY,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: .8,
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
          fontWeight: props.fontSize ? props.fontSize : '400',
          height: 56,
          flex: 1,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : Colors.WHITE,
        }}
        textAlign={props.textAlign ? props.textAlign : 'left'}
        underlineColorAndroid="transparent"
        value={value}
        keyboardType="phone-pad"
        placeholder={props.placeholder}
        maxLength={15}
        onFocus={() => {}}
        onChangeText={value => {
          setValue(value);
        }}
        onEndEditing={() => {
          props.onEndEditing && props.onEndEditing(value);
        }}
      />
      {rightAccImage && (
        <TouchableOpacity
          style={{
            height: '100%',
            width: 40,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
          onPress={() => {
            console.log('TouchableOpacity');
            props.onRightPressed && props.onRightPressed();
          }}>
          <Image
            resizeMode="contain"
            style={{width: 15, height: 15}}
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
