import React from 'react';
import {StyleSheet, View, Modal, Platform,Dimensions,Text, Image} from 'react-native';
const {width, height} = Dimensions.get('window');
import * as Colors from '../constants/ColorDefs';
import Lottie from 'lottie-react-native';
const loader = require('../../assets/loader_gf.gif');
 const SKLoader = (props) => {
    return (        
      <Modal
        transparent={true}
        animationType="fade"
        visible={true}
        onRequestClose={() => {}}>
        <View
          style={styles.alertContainer}>
          <View style={styles.indicator}>
            <Image
              style={styles.lottie}
              source={loader}
            />
          </View>
        </View>
      </Modal>
    );
  };

  export default SKLoader

  const styles = StyleSheet.create({
    lottie: {
      width: 100,
      height: 100,
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
      width: 100,
      height: 100,
      borderRadius: 30,
      backgroundColor: Colors.TRANS,
      justifyContent: 'space-around',
      alignItems: 'center',
      alignSelf: 'center',
    },
  });