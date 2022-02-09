import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  DeviceEventEmitter,
  Keyboard,
  Platform,
  Text,
  FlatList
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {
  onlineGetDependentInfoByUserId,
  onlineGetDependentInfoByTaxFileID,
  onlineSaveDependentInfo,
  onlineDeteleDependent,
} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'date-fns';

const EverSigners = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const allSigners = pageParams?.allSigners;
  const dochash = pageParams?.dochash;
  const doc = pageParams?.doc;
  const currentIndex = pageParams?.currentIndex;
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height:'100%'
      }}>
      <AppHeader navigation={navigation} />
      <FlatList
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        style={{width: '90%', marginTop: 100}}
        data={allSigners}
        keyExtractor={(item, index) => index + '_key'}
        ItemSeparatorComponent={() => (
          <View style={{width: 20, backgroundColor: 'pink'}} />
        )}
        renderItem={({item, index}) => (
          <SKButton
            fontSize={16}
            marginTop={10}
            width={'100%'}
            iconsize={20}
            rightImage={
              item?.eversign_document_hash?.length > 0
                ? CustomFonts.CheckRight
                : CustomFonts.ChevronRight
            }
            fontWeight={'normal'}
            backgroundColor={Colors.CLR_7F7F9F}
            borderColor={Colors.CLR_D3D3D9}
            title={item?.name}
            onPress={() => {
              navigation.navigate('SKWebPage', {
                lastScreenName:'EverSigners',
                pageUrl: item?.embedded_signing_url,
                noOfDocs: allSigners?.length,
                currentIndex: currentIndex,
                doc: doc,
                dochash: dochash,
                saveType: 1,
              });
            }}
          />
        )}
      />
    </View>
  );
};

export default EverSigners;
