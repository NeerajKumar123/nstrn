import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
const download = require('../../assets/download.png');
const TaxReturns = props => {
  const navigation = useNavigation()
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader 
        onLeftPress = {() =>{
          navigation.goBack()
        }}
      />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="TAX RETURNS" marginTop={124} />
        <Heading
          fontSize={16}
          marginTop={15}
          color={Colors.CLR_D9272A}
          value="PLEASE SEE LIST BELOW :"
        />
        <TaxReturnCard
            marginTop = {23}
          title="2018 TAX RETURN"
          onClick = {() =>{
            console.log('2018 TAX RETURN')
          }}
        />
        <TaxReturnCard
            marginTop = {23}
          title="2019 TAX RETURN"
          onClick = {() =>{
            console.log('2019 TAX RETURN')
          }}
        />
        <TaxReturnCard
            marginTop = {23}
          title="2020 TAX RETURN"
          onClick = {() =>{
            console.log('2020 TAX RETURN')
          }}
        />
        <TaxReturnCard
            marginTop = {23}
          title="2021 TAX RETURN"
          onClick = {() =>{
            console.log('2021 TAX RETURN')
          }}
        />
      </ScrollView>
    </View>
  );
};

const TaxReturnCard = props => {
  return (
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical:11,
          marginTop:props.marginTop,
          borderBottomWidth:1,
          borderBottomColor:Colors.CLR_00000020
        }}
        onPress={() => {
          props.onClick && props.onClick();
        }}>
        <Text
          style={{
            textAlign: 'left',
            color: Colors.BLACK,
            fontSize: 17,
            fontWeight: '400',
          }}>
          {props.title}
        </Text>
        <Image
        resizeMode = 'contain'
        style = {{width:24, height:24}}
        source = {download}
        />
      </TouchableOpacity>
  );
};

export default TaxReturns;
