import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  Text,
  DeviceEventEmitter,
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
import * as CustomFonts from '../constants/FontsDefs';
import {getUserProfileDetails, updateUserProfile} from '../apihelper/Api';
const arrow_dash = require('../../assets/tab/arrow_dash.png');
const mywallet = require('../../assets/tab/Vector.png');
const message = require('../../assets/tab/message.png');
const watsup = require('../../assets/tab/watsup.png');
const watsup1 = require('../../assets/tab/watsup1.png');

const share = require('../../assets/tab/share.png');

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
      <AppHeader navigation={navigation} />
      <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}>
        <Heading
          value="SUKH TAX LOYALTY PROGRAM"
          marginTop={12}
          fontWeight={'700'}
          fontSize={18}
          color={Colors.APP_RED_SUBHEADING_COLOR}
        />
        <View
          style={{
            height: 101,
            backgroundColor: Colors.APP_BLUE_HEADING_COLOR,
            marginTop: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 23,
              fontWeight: '700',
              marginLeft: 25,
              marginTop: 16,
            }}>
            Welcome, Japjot.
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              textAlign: 'right',
              fontWeight: '400',
              marginLeft: 100,
              marginBottom: 30,
              marginTop: 16,
            }}>
            Today
          </Text>
        </View>
        <View
          style={{
            height: 116,
            backgroundColor: Colors.CLR_FFFFFF,
            marginTop: 20,
            padding: 10,
            borderRadius: 26,

            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 21,
              fontWeight: '700',
              height: 25,
            }}>
            My Wallet
          </Text>
          <Image
            resizeMode="contain"
            style={{width: 25, height: 23}}
            source={mywallet}
            marginTop={6}
            color={Colors.APP_BLUE_HEADING_COLOR}
          />
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 29,
              marginTop: 16,
              textAlign: 'center',
              fontWeight: '700',
            }}>
            $ 55.00
          </Text>
        </View>
        <Heading
          value="Next Payout : Friday , Dec 10 2021"
          marginTop={26}
          color={Colors.APP_BLUE_HEADING_COLOR}
          fontSize={18}
        />
        <View
          style={{
            height: 93,
            backgroundColor: Colors.CLR_F7FAFF,
            marginTop: 13,
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 17,
              fontWeight: '700',
              marginTop: 18,
            }}>
            TOTAL CUMULATIVE EARNINGS
          </Text>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 29,
              marginTop: 3,
              textAlign: 'center',
              fontWeight: '700',
            }}>
            $595.00
          </Text>
        </View>
        <View
          style={{
            height: 116,
            backgroundColor: Colors.CLR_FFFFFF,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 18,
              fontWeight: '700',
              marginTop: 6,
            }}>
            My Refferal Code
          </Text>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 29,
              marginTop: 3,
              textAlign: 'center',
              fontWeight: '700',
            }}>
            JAPJOT50
          </Text>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              style={{width: 20, height: 20}}
              source={watsup}
              marginTop={9}
              color={Colors.APP_BLUE_HEADING_COLOR}
            />
            <Image
              resizeMode="contain"
              style={{width: 20, height: 20}}
              source={share}
              marginTop={9}
              marginLeft={14}
              color={Colors.APP_BLUE_HEADING_COLOR}
            />
            <Image
              resizeMode="contain"
              style={{width: 20, height: 20}}
              source={message}
              marginTop={9}
              marginLeft={14}
              color={Colors.APP_BLUE_HEADING_COLOR}
            />
          </View>
        </View>
        <SKButton
            fontSize={18}
            width="100%"
            marginTop = {28}
            rightImage={CustomFonts.right_arrow}
            fontWeight={'700'}
            backgroundColor={Colors.CLR_E77C7E}
            borderColor={Colors.CLR_E77C7E}
            title={'PAYOUT HISTORY'}
            onPress={() => {
              navigation.navigate('RoyaltyPayoutHistory');
            }}
          />

        <SKButton
          marginTop={10}
          fontSize={18}
          width="100%"
          rightImage={CustomFonts.right_arrow}
          fontWeight={'700'}
          backgroundColor={Colors.CLR_E77C7E}
          borderColor={Colors.CLR_E77C7E}
          title={'MY REFERRAL HISTORY'}
          onPress={() => {
            navigation.navigate('RoyaltyRefHistory');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default RoyaltyWallat;