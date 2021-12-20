import React , {useEffect, useState} from 'react';
import {TouchableOpacity, View, Image,Text,Button,StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import {getRefrralPrice} from '../apihelper/Api';

const RoyaltyInstruction = props => {
  const navigation = useNavigation();
  const [onlineFriendSave, setOnlineFriendSave] = useState()
  const [onlineYouSave, setOnlineYouSave] = useState()
  const [incorpFriendSave, setIncorpFriendSave] = useState()
  const [incorpYouSave, setIncorpYouSave] = useState()
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    getRefrralPrice((priceListRes)=>{
      setIsLoading(false)
      if (priceListRes?.status == 1) {
        let onlineFriendSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 1,
        );
        
        let onlineYouSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 2,
        );

        let incorpFriendSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 3,
        );

        let incorpYouSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 4,
        );
        const f = onlineFriendSaves[0];
        const s = onlineYouSaves[0];
        const t = incorpFriendSaves[0];
        const four = incorpYouSaves[0];

        setOnlineFriendSave(f?.referral_price)
        setOnlineYouSave(s?.referral_price)
        setIncorpFriendSave(t?.referral_price)
        setIncorpYouSave(four?.referral_price)
      }

    })
  }, [])

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
      <Text style={styles.blueText}>
      1) Sign up for our Loyalty Program.
      </Text>
      <Text style={styles.blueText}>
      2) Refer a friend and give them your unique referral code.
      </Text>
      <Text style={styles.blueText}>
      {`3) Your friend will save $${onlineFriendSave} at checkout of their Online Return, and you will receive $${onlineYouSave}.`}
      </Text>
      <Text style={styles.blueText}>
      {`4) If you refer a friend for incorporation, your friend will save $${incorpFriendSave}, and you will receive $${incorpYouSave}.`}
      </Text>
      <SKButton
          fontStyle = 'italic'
          marginTop = {30}
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
