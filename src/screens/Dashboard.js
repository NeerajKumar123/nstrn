import React from 'react';
import {Button, View, Text, TouchableOpacity,StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {testApi} from '../apihelper/Api.js';

const Dashboard = props => {
    const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => {
          console.log('Login');
          // navigation.navigate('Login');
          testApi({},()=>{
            console.log('I am called back.')
          })
        }}>
            <Text>
            Login
                </Text>
        
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
});
