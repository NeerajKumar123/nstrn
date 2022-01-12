import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  DeviceEventEmitter,
  Platform,
  Alert,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AnimTest = () => {
  const [x, setx] = useState(new Animated.Value(0));
  const [onRight, setonRight] = useState(false);
  var color = x.interpolate({
    inputRange: [0, SCREEN_WIDTH - 40, Number.MAX_VALUE],
    outputRange: ['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'],
  });

  const _onPress = () => {
    setonRight(!onRight);
    Animated.spring(x, {
      toValue: onRight ? SCREEN_WIDTH - 40 : 0,
    }).start();
  };
  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            _onPress();
          }}>
          <Text>Move</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Animated.View
          style={[styles.colorContainer, {backgroundColor: color}]}
        />
        <Animated.View style={[styles.movingBox, {left: x}]} />
      </View>
    </View>
  );
};

export default AnimTest;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  colorContainer: {
    height: 40,
    width: SCREEN_WIDTH,
    borderWidth: 1,
  },
  movingBox: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
  },
});
