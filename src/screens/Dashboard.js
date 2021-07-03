import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  DeviceEventEmitter
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DashCard from '../components/DashCard';
import {DashHeader} from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
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
    colors: [Colors.CLR_27275D, Colors.CLR_D72528],
  },
  {
    id: 2,
    name: 'VISIT US',
    desc: 'BOOK AN APPOINTMENT',
    image: visit_us,
    colors: [Colors.CLR_27275D, Colors.CLR_D72528],
  },
  {
    id: 3,
    name: 'ONLINE TAX RETURN',
    desc: 'STARTING FROM $44.99',
    image: online,
    colors: [Colors.CLR_EB0000, Colors.CLR_D72528],
  },
  {
    id: 4,
    name: 'INCORPORATION',
    desc: 'OPEN A CORPORATION',
    image: incorporation,
    colors: [Colors.CLR_EB0000, Colors.CLR_D72528],
  },
  {
    id: 5,
    name: 'REQUEST TAX DOCS',
    desc: 'NOA, T1,GENERAL, etc.',
    image: request,
    colors: [Colors.CLR_D72528, Colors.CLR_27275D],
  },
  {
    id: 6,
    name: 'CRA LATTERS',
    desc: 'CORRESPONDENCE',
    image: cra_latters,
    colors: [Colors.CLR_D72528, Colors.CLR_27275D],
  },
];


const Dashboard = props => {
  const navigation = useNavigation();
const navigateToScreen = (item) =>{
  switch (item.id) {
    case 1:
      navigation.navigate('Home')
      break;
      case 3:
      navigation.navigate('Identification')
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
      <DashHeader onRightClicked = {()=>{
        console.log('onRightClicked')
        navigation.navigate('Profile')
      }} />
      {data && (
        <FlatList
          contentContainerStyle={{
            backgroundColor: Colors.WHITE,
            marginVertical: 10,
            marginHorizontal: 20,
            justifyContentL: 'center',
            alignItems: 'center',
          }}
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
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          marginBottom: 30,
        }}>
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
          DeviceEventEmitter.emit('user_loggedin',false)
        }}>
          <Image
            resizeMode="contain"
            style={{width: 15, height: 15, marginRight: 5}}
            source={logout_icon}
          />
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;


const styles = StyleSheet.create({});
