import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
const profile = require('../../assets/profile.png');
const request = require('../../assets/request.png');
const messeges = require('../../assets/messeges.png');
const Home = props => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader 
      onLeftPress = {()=>{
        navigation.goBack()
      }}
      />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="Home" marginTop={122} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="Welcome, JAPJOT"
        />
        <Heading
          fontSize={16}
          marginTop={25}
          color={Colors.CLR_29295F}
          value="RECENT REQUEST"
        />
        <Heading
          fontSize={16}
          status={2}
          marginTop={15}
          color={Colors.CLR_29295F}
          value="TAX FILING"
        />
        <Heading
          fontSize={16}
          status={1}
          marginTop={5}
          color={Colors.CLR_29295F}
          value="INCORPORATION"
        />
        <Heading
          fontSize={16}
          status={2}
          marginTop={5}
          color={Colors.CLR_29295F}
          value="CRA LETTERS"
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 46,
            justifyContent: 'space-between',
          }}>
          <ProfDoccCardView image={profile} title="PROFILE" onClicked = {() =>{
            navigation.navigate('Profile')
          }}/>
          <ProfDoccCardView image={request} title="DOCUMENTS" onClicked = {() =>{
            navigation.navigate('Documents')
          }}/>
        </View>
        <MessegesView onClicked = {()=>{
          navigation.navigate('Messages')
        }} />
      </ScrollView>
    </View>
  );
};

const ProfDoccCardView = props => {
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.CLR_D9272A, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: 165,
        height: 100,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 48,
            height: 48,
          }}
          source={props.image}
        />
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '800',
            marginTop: 5,
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const MessegesView = props => {
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.CLR_D9272A, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 90,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            MESSAGES :
          </Text>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            2 NEW MESSAGES
          </Text>
        </View>
        <Image
          resizeMode="contain"
          style={{
            width: 42,
            height: 38,
          }}
          source={messeges}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Home;
