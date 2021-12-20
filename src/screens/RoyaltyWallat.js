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
  Share
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
import {refGetDetails} from '../apihelper/Api';
const arrow_dash = require('../../assets/tab/arrow_dash.png');
const mywallet = require('../../assets/tab/Vector.png');
const message = require('../../assets/tab/message.png');
const watsup = require('../../assets/tab/watsup.png');
const watsup1 = require('../../assets/tab/watsup1.png');

const share = require('../../assets/tab/share.png');

const RoyaltyWallat = props => {
  const navigation = useNavigation();
 const [isLoading, setIsLoading] = useState(false);
 const [details, setDetails] = useState()

  useEffect(() => {
    setIsLoading(true)
    const {user_id} = global.onlineStatusData
    const params = {User_Id:user_id}
    refGetDetails(params, (res) =>{
      setTimeout(() => {
        setIsLoading(false)
      }, 200);
      if(res?.status == 1){
        console.log('res?.data?.[0]',res?.data?.[0])
        setDetails(res?.data?.[0])
      }
    })
  }, [])

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:'Hello from Sukhtax',
        url:'urltobeshared',
        // title:'title',
        // dialogTitle:'dialogTitleonlyforandroid',
        // tintColor:'tintColoronlyios',
        // subject:'onlyforiosmails',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


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
            backgroundColor: Colors.APP_BLUE_HEADING_COLOR,
            marginTop: 12,
            borderRadius: 8,
            flexDirection: 'column',
            padding:10
          }}>
             <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '400',
            }}>
            Welcome,
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 23,
              fontWeight: '700',
              marginTop: 12,
            }}>
           {`${details?.user_name}`}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.CLR_FFFFFF,
            marginTop: 20,
            padding: 8,
            borderRadius: 8,
            borderColor:'skyblue',
            borderWidth:.3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 21,
              fontWeight: '700',
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
              marginTop: 6,
              textAlign: 'center',
              fontWeight: '700',
            }}>
            {`$${details?.wallet_amount || 0}`}
          </Text>
        </View>
        {details?.next_payout && 
        <Heading
        value={`Next Payout :${details?.next_payout}`}
        marginTop={10}
        color={Colors.APP_BLUE_HEADING_COLOR}
        fontSize={18}
      />
        }
        <View
          style={{
            backgroundColor: Colors.CLR_F7FAFF,
            marginTop: 13,
            padding: 10,
            borderRadius: 8,
            borderWidth:.5,
            borderColor:'pink',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 17,
              fontWeight: '700',
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
            {`$${details?.cumulative_earnings || 0}`}
          </Text>
        </View>
        <View
          style={{
            marginTop:20,
            borderRadius: 8,
            borderColor:'skyblue',
            borderWidth:.3,
            padding:10,
            alignItems: 'center',
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
             {`${details?.referral_code}`}
          </Text>

          <TouchableOpacity
          style = {{position:'absolute', right:10, top:10}}
          onPress={() =>{
            onShare()
          }}
          >
          <Image
              resizeMode="contain"
              style={{width: 15, height: 15}}
              source={share}
              color={Colors.APP_BLUE_HEADING_COLOR}
            />
          </TouchableOpacity>
          
          
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
            navigation.navigate('RoyaltyRefHistory', {referral_code:details?.referral_code});
          }}
        />
      </ScrollView>
    </View>
  );
};

export default RoyaltyWallat;