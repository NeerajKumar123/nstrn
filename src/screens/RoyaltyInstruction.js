import {TouchableOpacity, View, Image,Text,Button,StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import {getRefrralPrice} from '../apihelper/Api'
import React, {useState,useEffect} from 'react';
import InstCard from '../components/InstCard';
import TilesCard from '../components/TilesCard';
const ins1 = require('../../assets/tab/ins1.png');
const ins2 = require('../../assets/tab/ins2.png');
const ins3 = require('../../assets/tab/ins3.png');
const Vector9 = require('../../assets/tab/Vector 9.png');
const Vector10 = require('../../assets/tab/Vector 10.png');

const RoyaltyInstruction = props => {
  console.log("neeshu",props)
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [onlineFriendSave, setOnlineFriendSave] = useState()
  const [onlineYouSave, setOnlineYouSave] = useState()
  const [incorpFriendSave, setIncorpFriendSave] = useState()
  const [incorpYouSave, setIncorpYouSave] = useState() 
  useEffect(() => {
    getRefrralPrice((priceListRes)=>{
      console.log('res',JSON.stringify(priceListRes))
      if (priceListRes?.status == 1) {
        let onlineFriendSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 1,
        ); 
        setOnlineFriendSave(onlineFriendSaves[0])
        let onlineYouSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 2,
        );
        setOnlineYouSave(onlineYouSaves[0])
        let incorpFriendSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 3,
        );
        setIncorpFriendSave(incorpFriendSaves[0])
        let incorpYouSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 4,
        );
        setIncorpYouSave(incorpYouSaves[0])
      }

    })
  },  [])
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
        {console.log('incorpYouSave',onlineFriendSave,onlineYouSave,incorpFriendSave,incorpYouSave)
}
      <AppHeader navigation={navigation}/>
      <View style={{ 
      width:'100%',  
      paddingHorizontal:20,
      alignItems:"center",
      }}>
        {isLoading && <SKLoader/>}
        <Heading value="Sukh Tax Loyalty Program" fontSize = {18} marginTop={26} color = {Colors.APP_RED_SUBHEADING_COLOR}  />
       

       
       
       
        <Text 
        style={styles.howitwork}>
        How does this work ?
        </Text> 
        <Text  style={styles.blueText}>
        Sukh Tax aims to make your experience as simple as possible.
        </Text> 
        <Text style={styles.blueText}>
        Our loyalty program is no different.
        </Text>
        <View style = {{flexDirection: "column",
         paddingHorizontal: 20 }}>
       <InstCard
          text={'1) Sign up for our Loyalty\n Program'}
          marginTop={20}
        />
       <InstCard
          text={'2)Refer a friend and give\nthem your unique referral\ncode'}
          marginTop={20}
          />
        <View style = {{backgroundColor: "red"}}>
        <InstCard
          text={'3)Your friend enters the \ncode when making \npayment'}
          marginTop={20}
        /> 
        </View>
        <View style = {{flexDirection: "row",width: "100%",backgroundColor: "white",justifyContent: "space-between",marginTop: 32}}>
        <TilesCard
          title={'ONLINE TAX     \n RETURN'}
          desc ={'YOUR FRIEND \nSAVE $5\nYOU GET PAID\n$5'}
        />  
        <TilesCard
          title={'COMPANY \n INCORPORATION'}
          desc ={'YOUR FRIEND \nSAVE $15\nYOU GET PAID\n$15'}
        /> 
        </View>
        
        </View>
      {/* <Text style={styles.blueText}>
      1) Sign up for our Loyalty Program.
      </Text>
      <Text style={styles.blueText}>
      2) Refer a friend and give them your unique referral code.
      </Text> */}
      {/* <Text style={styles.blueText}>
      {`3) Your friend will save $${onlineFriendSave} at checkout of their Online Return, and you will receive $${onlineYouSave}.`}
      </Text>
      <Text style={styles.blueText}>
      {`4) If you refer a friend for incorporation, your friend will save $${incorpFriendSave}, and you will receive $${incorpYouSave}.`}
      </Text> */}
      <SKButton
          fontStyle = 'italic'
          marginTop = {70}
          fontSize={16}
          fontWeight={'500'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.PRIMARY_BORDER}
          title={'ENROLL NOW'}
          onPress={() => {
            navigation.navigate('RoyaltySubmit')
          }}
        />
      </View>
    </View>
  );
};

export default RoyaltyInstruction;


const styles = StyleSheet.create({
  howitwork :{
    fontSize:15,
    color:Colors.APP_BLUE_HEADING_COLOR,
    width:'100%',
    fontWeight:'500',
    marginTop:16
  },
  blueText :{
    fontSize:17,
    color:Colors.APP_BLUE_HEADING_COLOR,
    width:'100%',
    fontWeight:'500',
    marginTop:16
  }
})
