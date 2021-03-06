import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Platform,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('window');
import Pdf from 'react-native-pdf';

const cross = require('../../assets/cross.png');
const DocumentViewer = props => {
  const {item, onClose} = props;
  const [isReady, setIsReady] = useState(false);
  const isPDF = item?.document_file_name?.includes('.pdf');
  let uri = item?.document_file_name || ''
  uri = uri.replace(" " ,"%20")
  let source = {uri: uri, cache: true};
  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      width={'100%'}
      onCancel={() => {}}>
      <CloseButtonHeader
        title={item.document_title}
        onClose={() => {
          onClose && onClose();
        }}
      />
      {isPDF ? (
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link presse: ${uri}`);
          }}
          style={{flex: 1}}
        />
      ) : (
        <Image
          resizeMode="contain"
          style={{flex: 1}}
          source={{uri: item.document_file_name}}
        />
      )}
    </Modal>
  );
};

const CloseButtonHeader = props => {
  const {title} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: Platform.OS == 'ios' ?  64 : 10 ,
        marginBottom: 5,
      }}>
      <Text
        numberOfLines={2}
        style={{
          color: Colors.CLR_14273E,
          fontSize: 14,
          flex: 1,
          textAlign: 'center',
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
        <Icon name={'close-circle-outline'} size={30} color={Colors.DARKGRAY} />
      </TouchableOpacity>
    </View>
  );
};

export default DocumentViewer;
