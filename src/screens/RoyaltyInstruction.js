import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {getRefrralPrice} from '../apihelper/Api';
import React, {useState, useEffect} from 'react';
import InstCard from '../components/InstCard';
import TilesCard from '../components/TilesCard';
const ins1 = require('../../assets/tab/ins1.png');
const ins2 = require('../../assets/tab/ins2.png');
const ins3 = require('../../assets/tab/ins3.png');
const Vector9 = require('../../assets/tab/Vector 9.png');
const Vector10 = require('../../assets/tab/Vector 10.png');

const RoyaltyInstruction = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [onlineFriendSave, setOnlineFriendSave] = useState('');
  const [onlineYouSave, setOnlineYouSave] = useState('');
  const [incorpFriendSave, setIncorpFriendSave] = useState('');
  const [incorpYouSave, setIncorpYouSave] = useState('');
  useEffect(() => {
    getRefrralPrice(priceListRes => {
      if (priceListRes?.status == 1) {
        let onlineFriendSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 1,
        );
        setOnlineFriendSave(onlineFriendSaves[0]?.referral_price);
        let onlineYouSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 2,
        );
        setOnlineYouSave(onlineYouSaves[0]?.referral_price);
        let incorpFriendSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 3,
        );
        setIncorpFriendSave(incorpFriendSaves[0]?.referral_price);
        let incorpYouSaves = priceListRes?.data?.filter(
          fee => fee.referral_price_id == 4,
        );
        setIncorpYouSave(incorpYouSaves[0]?.referral_price);
      }
    });
  }, []);
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: 'white',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%', height:'100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        {isLoading && <SKLoader />}
        <Heading
          value="SUKH TAX LOYALTY PROGRAM"
          fontSize={18}
          marginTop={26}
          color={Colors.APP_RED_SUBHEADING_COLOR}
        />
        <Text style={styles.howitwork}>How does this work ?</Text>
        <Text style={styles.blueText}>
          Sukh Tax aims to make your experience as simple as possible.
        </Text>
        <Text style={[styles.blueText,{marginTop:20}]}>
          Our loyalty program is no different.
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginTop: 10,
          width: '100%',
        }}>
        <InstCard text={'1) Sign up for our Loyalty Program'} image={ins1} />
        <InstCard
          text={'2) Refer a friend and give\nthem your unique referral code'}
          image={ins2}
        />
        <InstCard
          text={'3) Your friend enters the code when making payment'}
          image={ins3}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          marginTop: 32,
        }}>
        <TilesCard
          title={'ONLINE TAX RETURN'}
          desc={`YOUR FRIEND SAVE\n$${onlineFriendSave}`}
          desc1={`YOU GET PAID\n$${onlineYouSave}`}
        />
        <TilesCard
          title={'COMPANY INCORPORATION'}
          desc={`YOUR FRIEND SAVE\n$${incorpFriendSave}`}
          desc1={`YOU GET PAID\n$${incorpYouSave}`}
        />
      </View>
      <SKButton
        fontStyle="italic"
        marginTop={29}
        fontSize={16}
        fontWeight={'600'}
        backgroundColor={Colors.CLR_EB0000}
        borderColor={Colors.PRIMARY_BORDER}
        title={'ENROLL NOW'}
        onPress={() => {
          navigation.navigate('RoyaltySubmit');
        }}
      />
      {Platform.OS == 'android' && <View style = {{height:100, width:'100%'}}/>}
      </ScrollView>
    </View>
  );
};

export default RoyaltyInstruction;

const styles = StyleSheet.create({
  howitwork: {
    fontSize: 18,
    color: Colors.APP_BLUE_HEADING_COLOR,
    width: '100%',
    fontWeight: '400',
    marginTop: 20,
  },
  blueText: {
    fontSize: 18,
    color: Colors.APP_BLUE_HEADING_COLOR,
    width: '100%',
    fontWeight: '400',
    marginTop: 9,
  },
});
