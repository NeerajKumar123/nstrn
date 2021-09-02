import React, {useState} from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import SKButton from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
const CarryForward = props => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1
      }}>
      <AppHeader
      navigation={navigation}
      />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20
        }}>
        <Heading value="CARRY FORWARD" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE SEE THAT YOU FILED
          YOUR RETURN THROUGH
          THE APP LAST. WOULD YOU
          LIKE TO PRE-POPULATE
          YOUR RETURN?"
        />
        <Heading
          fontSize={16}
          marginTop={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="DON'T WORRY, YOU'LL
          HAVE A CHANCE TO EDIT THE
          DETAILS THAT HAVE
          CHANGED"
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.CLR_7F7F9F}
            borderColor={Colors.CLR_D3D3D9}
            title={'NO'}
            onPress={() => {
              navigation.navigate('Identification');
            }}
          />
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'YES'}
            onPress={() => {
              navigation.navigate('Identification');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CarryForward;
