import React, {useEffect, useState} from 'react';
import {Modal, View, Platform, FlatList, Text, Image,TouchableOpacity,Dimensions} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('window');

const cross = require('../../assets/cross.png');
const  DocumentViewer = props => {
  const {item,onClose} = props
  const array = item.document_file_name?.split('/');
  const [lastItem] = array.slice(-1);
  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      width = {'100%'}
      onCancel={() => {}}>
        <CloseButtonHeader
          title={lastItem}
          onClose={() => {
            onClose && onClose();
          }}
        />
       <Image
            resizeMode = 'contain'
            style = {{ flex:1}}
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
        marginTop:64,
        marginBottom:5
      }}>
      <Text
      numberOfLines  = {2}
        style={{
          color: Colors.CLR_14273E,
          fontSize: 14,
          flex:1,
          textAlign:'center'
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
