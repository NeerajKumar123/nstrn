import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
const profile = require('../../assets/profile.png');
const request = require('../../assets/request.png');
const messeges = require('../../assets/messeges.png');
const Documents = props => {
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="DOCUMENTS" marginTop={122} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="WHICH DOCUMENTS WOULD 
          YOU LIKE TO SEE"
        />
        <DocOptionCard
          grads={[Colors.CLR_D9272A, Colors.CLR_D72528]}
          title="TAX RETURNS"
        />
        <DocOptionCard
          grads={[Colors.CLR_29295F, Colors.CLR_29295F]}
          title="INCORPORATION DOCS"
        />
        <DocOptionCard
          grads={[Colors.CLR_D9272A, Colors.CLR_D72528]}
          title="T1 GENERAL, NOA, T-SLIPS"
        />
        <DocOptionCard
          grads={[Colors.CLR_29295F, Colors.CLR_29295F]}
          title="CRA LETTERS DOCS"
        />
      </ScrollView>
    </View>
  );
};

const DocOptionCard = props => {
  return (
    <LinearGradient
      opacity={0.8}
      colors={props.grads}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 64,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onLeftPress && props.onLeftPress();
        }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'left',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '700',
            marginTop: 5,
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Documents;
