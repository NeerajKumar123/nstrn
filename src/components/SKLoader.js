import React from 'react';
import {StyleSheet, View, Modal, Platform,Dimensions,Text} from 'react-native';
const {width, height} = Dimensions.get('window');
import * as Colors from '../constants/ColorDefs';

const loader = require('../../assets/loader.json');
 const SKLoader = (props) => {
    return (        
      <Modal
        transparent={true}
        animationType="fade"
        visible={true}
        onRequestClose={() => {}}>
        <View
          style={styles.alertContainer}>
          <View style={styles.indicator}/>
        </View>
      </Modal>
    );
  };

  export default SKLoader

  const styles = StyleSheet.create({
    lottie: {
      width: 60,
      height: 60,
    },
    alertContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      backgroundColor: Colors.CLR_00000090,
      margin: 0,
      position: 'absolute',
      zIndex: 1000,

    },
    indicator: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors.TRANS,
      justifyContent: 'space-around',
      alignItems: 'center',
      alignSelf: 'center',
    },
  });