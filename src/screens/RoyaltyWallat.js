import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  Text,
  DeviceEventEmitter
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import { useNavigation } from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import { ST_REGEX } from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import { getUserProfileDetails, updateUserProfile } from '../apihelper/Api';
const arrow_dash = require('../../assets/tab/arrow_dash.png');

const RoyaltyWallat = props => {
  const navigation = useNavigation();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,

      }}>
      {isLoading && <SKLoader />}
      <AppHeader navigation = {navigation}/>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          flex: 1,
        }}>
          <Heading value="SUKH TAX LOYALTY PROGRAM" marginTop={12} fontWeight={"700"} fontSize={18} color={Colors.APP_RED_SUBHEADING_COLOR} />
        <View 
       style = {{
           height:101,
           backgroundColor:Colors.APP_BLUE_HEADING_COLOR,
            marginTop : 12,
            borderRadius: 8,
            justifyContent: "flex-end",
            alignContent: 'flex-end'
         }}>
               <Text style = {{
                   color:"white",
                   fontSize: 23,
                   fontWeight: "700",
                   marginLeft: 25,
                   marginTop:16


               }}>
                 Welcome, Japjot.
               </Text>
               <Text style = {{
                   color:"white",
                   fontSize: 25,
                   textAlign :"right",
                   fontWeight : "bold",


               }}>
              Today
               </Text>
       </View>
       <View 
       style = {{
           height:116,
           backgroundColor:Colors.CLR_FFFFFF,
           marginTop: 20, 
           padding: 10,
           borderRadius: 26,
           }}>
               <Text style = {{
                   color:"blue",
                   fontSize: 21,
                   fontWeight : "700",
                   height:25}}>
                  My Wallet
               </Text>
               <Text style = {{
                   color:"blue",
                   fontSize: 21,
                   marginTop: 16,
                   textAlign :"center",
                   fontWeight : "700"

               }}>
                $ 55.00
               </Text>
       </View>
       <Heading value="NEXT PAYOUT: FRIDAY, DEC 10 2021" marginTop={26} color = {Colors.APP_RED_SUBHEADING_COLOR} fontSize = {18} />
       <Heading value="MY REFERRAL CODE:" marginTop={37} color = {Colors.BLACK} fontSize = {18} />
       <Text style = {{
                   color:Colors.BLACK,
                   fontSize: 40,
                   marginTop: 16,
                   textAlign :"center",
                   fontWeight : "bold"

               }}>
            JAP10283
               </Text>
       <View
       style={{
        flexDirection: 'row',
        width: '100%',
        backgroundColor: "red"
      }}>
        
       <SKButton
        fontSize={18}
        width="100%"
        fontWeight={'700'}
        backgroundColor={Colors.CLR_E77C7E}
        borderColor={Colors.CLR_E77C7E}
        title={'PAYOUT HISTORY'}
        onPress = {() =>{
            navigation.navigate('RoyaltyRefHistory')
            }}   
      />
      <Image
          resizeMode="contain"
          style={{width: 16, height: 16}}
          source={arrow_dash}
        />
       </View>
          
          <SKButton
        marginTop={10}
        fontSize={18}
        
        width="100%"
        fontWeight={'700'}
        backgroundColor={Colors.CLR_E77C7E}
        borderColor={Colors.CLR_E77C7E}
        title={'MY REFERRAL HISTORY'}
        onPress = {() =>{
            navigation.navigate('RoyaltyRefHistory')
            }}
      />
        
        
        
      </ScrollView >
    </View >
  );
};

export default RoyaltyWallat;
