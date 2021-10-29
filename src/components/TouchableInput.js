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
const TouchableInput = props => {
  const {value, onFocused, onClicked = undefined} = props;
  const [initialValue, setInitialValue] = useState(value);
  useEffect(() => {
    setInitialValue(value);
  }, [value]);
  const {
    leftAccImage,
    rightAccImage,
    marginTop = 15,
    marginBottom = 10,
    placeholder = 'Select value',
    fontSize = 15,
    height = 60
  } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        onClicked && onClicked();
      }}
      style={{
        width: '100%',
        height: height,
        padding: 3,
        paddingHorizontal: 20,
        borderColor: Colors.GRAY,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: Colors.WHITE,
        shadowColor: Colors.LIGHTGRAY,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.8,
        marginTop : marginTop,
        marginBottom,
      }}>
      {leftAccImage && (
        <Icon
        style={{marginRight: 21}}
        name={leftAccImage}
        size={25}
        color={Colors.DARKGRAY}
      />
      )}
      <Text
        style={{
          flex: 1,
          fontFamily: CustomFonts.OpenSansRegular,
          fontSize: fontSize,
          color: value ? Colors.BLACK : Colors.LIGHTGRAY,
        }}>
        {value || placeholder}
      </Text>
      {rightAccImage && (
        <Icon
          style={{marginLeft: 21}}
          name={rightAccImage}
          size={25}
          color={Colors.DARKGRAY}
        />
      )}
    </TouchableOpacity>
  );
};

export default TouchableInput;

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
