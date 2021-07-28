import React, {useEffect, useState} from 'react';
import {Modal, View, Platform, FlatList, Text, Image,TouchableOpacity,Dimensions} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('window');

const cross = require('../../assets/cross.png');
const  DocumentViewer = props => {
  const {item,onClose} = props
  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      width = {'100%'}
      onCancel={() => {}}>
        <CloseButtonHeader
          title={' '}
          onClose={() => {
            onClose && onClose();
          }}
        />
       <Image
            resizeMode = 'contain'
            style = {{width:width, height:'100%'}}
            source = {{uri:item.document_file_name}}
          />
    </Modal>
  );
};

const CloseButtonHeader = props => {
  const { title } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        height: 30,
        marginTop:64
      }}>
      <Text
        style={{
          color: Colors.CLR_14273E,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        {title}
      </Text>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClose && props.onClose();
        }}>
        <Icon
          name={'close-circle-outline'}
          size={30}
          color={Colors.DARKGRAY}
        />
      </TouchableOpacity>
    </View>
  );
};

export default DocumentViewer;
