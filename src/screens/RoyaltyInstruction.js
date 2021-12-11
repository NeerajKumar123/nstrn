import React from 'react';
import {TouchableOpacity, View, Image,Text,Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'

const RoyaltyInstruction = props => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom:10,
        width: '100%',
      }}>
      <AppHeader navigation={navigation}/>
      <View style={{ 
      width:'100%',  
      paddingHorizontal:20,
      alignItems:"center",
      }}>
      <Text
            style={{
              color: Colors.BLACK,
              fontSize: 25,
              fontWeight: '500',
              alignContent:"center",
              }}>
             Sukh Tax Loyalty Program
          </Text>
          <Text style={{
              color: Colors.BLACK,
              fontSize: 25,
              fontWeight: '500',
             
              padding:50
              }}>
          How does it work?
          </Text>
      </View>
      <View style={{ 
      width:'100%',  
      paddingHorizontal:20,
      alignItems:"center",}}>
        <Text style={{fontSize:20}}>
        Sukh Tax aims to make your experience as simple as possible.
        </Text> 
      </View>
      <View style={{paddingHorizontal:10,alignItems:"flex-start"}}>
        <Text style={{fontSize:20,paddingTop:25,paddingHorizontal:10,fontWeight:"400"}}>
        Our loyalty program is no different.
        </Text>
        </View>
        <View
        style = {{alignItems:"flex-start",paddingHorizontal:5}}>
        <Text style={{fontSize:20,paddingTop:25}}>
      1) Sign up for our Loyalty Program
      </Text>
      <Text style={{fontSize:20,paddingTop:25}}>
      2) Refer a friend and give them your unique referral code      </Text>
      <Text style={{fontSize:20,paddingTop:25}}>
      3) Your friend will save $5 at checkout of their Online Return, and you will receive $5      </Text>
      <Text style={{fontSize:20,paddingTop:25}}>
      4) If you refer a friend for incorporation, your friend will save $15, and you will receive $15      </Text>
      </View>
      <View style = {{backgroundColor:"red",paddingVertical:5,paddingHorizontal:90}}>
      <Button
      style = {{
        color: 'red',
        marginTop: 20,
        padding: 20,
        backgroundColor: 'green'
      }}
        title="SignUp"
        onPress = {() =>{
          navigation.navigate('RoyaltySignup')
          }}/>
      </View>
    </View>
  );
};

export default RoyaltyInstruction;
