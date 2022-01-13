import React from 'react';
import {StyleSheet, View, Modal} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import Lottie from 'lottie-react-native';
const loader = require('../../assets/loader.json');
const SKLoader = props => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={true}
      onRequestClose={() => {}}>
      <View style={styles.alertContainer}>
        <View style={styles.indicator}>
          <Lottie style={styles.lottie} autoPlay loop source={loader} />
        </View>
      </View>
    </Modal>
  );
};

export default SKLoader;

const styles = StyleSheet.create({
  lottie: {
    width: 150,
    height: 150,
  },
  alertContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: Colors.CLR_00000030,
    margin: 0,
    position: 'absolute',
    zIndex: 1000,
  },
  indicator: {
    width: 150,
    height: 150,
    backgroundColor: Colors.TRANS,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
