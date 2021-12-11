import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import {getUserProfileDetails, updateUserProfile} from '../apihelper/Api';

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
        <Heading value="Sukh Tax Loyalty Program" marginTop={26} color = {Colors.BLACK}  />
        <Heading value="Welcome,Japjot" marginTop={26} color = {Colors.BLACK}  />
       <View 
       style = {{
           height:150,
           backgroundColor:Colors.APP_BLUE_HEADING_COLOR,
           marginTop: 15, 
           padding: 10}}>
               <Text style = {{
                   color:"white",
                   fontSize: 30,
                   fontWeight: "bold"


               }}>
                   My Wallet
               </Text>
               <Text style = {{
                   color:"white",
                   fontSize: 40,
                   marginTop: 16,
                   textAlign :"center",
                   fontWeight : "bold"

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
       
               <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'MY REFERRAL HISTORY'}
        onPress = {() =>{
            navigation.navigate('RoyaltyRefHistory')
            }}
      />
        
        
        
      </ScrollView>
    </View>
  );
};

export default RoyaltyWallat;
