import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  DeviceEventEmitter,
  Platform
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DashCard from '../components/DashCard';
import {DashHeader} from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
const logout_icon = require('../../assets/logout_icon.png');

const home = require('../../assets/home.png');
const visit_us = require('../../assets/visit_us.png');
const online = require('../../assets/online.png');
const incorporation = require('../../assets/incorporation.png');
const request = require('../../assets/request.png');
const cra_latters = require('../../assets/cra_latters.png');

const data = [
  {
    id: 1,
    name: 'HOME',
    desc: 'STATUS PROFILE MY DOCUMENTS',
    image: home,
    colors: [Colors.CLR_7F7F9F, Colors.CLR_E77C7E],
  },
  {
    id: 2,
    name: 'VISIT US',
    desc: 'BOOK AN APPOINTMENT',
    image: visit_us,
    colors: [Colors.CLR_7F7F9F, Colors.CLR_E77C7E],
  },
  {
    id: 3,
    name: 'ONLINE TAX RETURN',
    desc: 'STARTING FROM $44.99',
    image: online,
    colors: [Colors.CLR_E77C7E, Colors.CLR_E77C7E],
  },
  {
    id: 4,
    name: 'INCORPORATION',
    desc: 'OPEN A CORPORATION',
    image: incorporation,
    colors: [Colors.CLR_E77C7E, Colors.CLR_E77C7E],
  },
  {
    id: 5,
    name: 'REQUEST TAX DOCS',
    desc: 'NOA, T1,GENERAL, etc.',
    image: request,
    colors: [Colors.CLR_E77C7E, Colors.CLR_7F7F9F],
  },
  {
    id: 6,
    name: 'CRA LATTERS',
    desc: 'CORRESPONDENCE',
    image: cra_latters,
    colors: [Colors.CLR_E77C7E, Colors.CLR_7F7F9F],
  },
];


const Dashboard = props => {
  const navigation = useNavigation();
const navigateToScreen = (item) =>{
  console.log('item',item)
  switch (item.id) {
    case 1:
      navigation.navigate('Home')
      break;
      case 3:
      navigation.navigate('OnlineReturnLanding')
      break;
      case 4:
        navigation.navigate('IncorporationLanding')
        break;
    default:
      break;
  }
}

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      <DashHeader 
      onRightClicked = {()=>{
        console.log('onRightClicked')
        navigation.navigate('Profile')
      }} />
      {data && (
        <FlatList
          contentContainerStyle={{
            backgroundColor: Colors.WHITE,
            marginTop: 10,
            marginBottom:100,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom:50,
          }}
          alwaysBounceVertical= {false}
          keyExtractor={(item, index) => 'key_' + index}
          data={data}
          numColumns={2}
          renderItem={({item}) => (
            <DashCard
              item={item}
              onSelected={() => {
                console.log('onSelected==>', item);
                navigateToScreen(item)
              }}
            />
          )}
        />
      )}
      <View
        style={{
          width: '100%',
          position:'absolute',
          bottom: Platform.OS == 'ios' ?  20 : 0,
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
        }}>
        <TouchableOpacity style={{flexDirection: 'row',justifyContent:'center', alignItems:'center'}} onPress={() => {
          DeviceEventEmitter.emit('user_loggedin',false)
        }}>
          <Image
            resizeMode="contain"
            style={{width: 20, height: 18, marginRight: 5}}
            source={logout_icon}
          />
          <Text style = {{fontWeight:'700', fontSize:16, fontFamily:CustomFonts.OpenSansRegular}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;


const styles = StyleSheet.create({});
