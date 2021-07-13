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
const SKDropdown = props => {
  const {value, onFocused} = props;
  const [initialValue, setInitialValue] = useState(value);
  useEffect(() => {
    setInitialValue(value);
  }, [value]);
  const {
    rightAccImage,
    marginTop = 10,
    marginBottom = 10,
    placeholder = 'Select value',
  } = props;
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        height: 60,
        padding: 3,
        paddingHorizontal: 33,
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
        marginTop,
        marginBottom,
      }}>
      <Text>{value || placeholder}</Text>
      <Icon
        style={{position: 'absolute', right: 20}}
        name="chevron-down"
        size={30}
        color={Colors.DARKGRAY}
      />
    </TouchableOpacity>
  );
};

export default SKDropdown;

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
