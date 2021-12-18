import React, {useState, useRef, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Alert,
  Button,
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
import RoyaltyPayCard from '../components/RoyaltyPayCard';
import {getPayoutHistory} from '../apihelper/Api';

const DummyArray = [
  {
    usename: 'neeshu',
    MypaymentMode: 'mode',
    MyDate: 'Date',
    Myamount: 'Amount',
  },
  {
    username: 'neeshu',
    MypaymentMode: 'online',
    Myamount: '$5',
    MyDate: 'dec 1',
  },
  {
    username: 'neeshu',
    MypaymentMode: 'online',
    Myamount: '$5',
    MyDate: 'dec 1',
  },
  {
    username: 'neeshu',
    MypaymentMode: 'online',
    Myamount: '$5',
    MyDate: 'dec 1',
  },
  {
    username: 'neeshu',
    MypaymentMode: 'online',
    Myamount: '$5',
    MyDate: 'dec 1',
  },
  {
    username: 'neeshu',
    MypaymentMode: 'online',
    Myamount: '$5',
    MyDate: 'dec 1',
  },
  {
    username: 'neeshu',
    MypaymentMode: 'online',
    Myamount: '$5',
    MyDate: 'dec 1',
  },
  {
    username: 'neeshu',
    MypaymentMode: 'online',
    Myamount: '$5',
    MyDate: 'dec 1',
  },
];

const RoyaltyPayoutHistory = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState();
  const [hostoryData, setHostoryData] = useState();

  useEffect(() => {
    const {user_id} = global.onlineStatusData;
    const params = {User_Id: user_id};
    setIsLoading(true);
    getPayoutHistory(params, res => {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
      console.log('res===>', res);
      if (res?.status == 1) {
        setHostoryData(res?.data);
      }
    });
  }, []);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: 25,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: Colors.APP_RED_SUBHEADING_COLOR,
            width: '100%',
          }}>
          PAYOUT HISTORY
        </Text>
        <FlatList
          style={{
            width: '100%',
            marginTop: 40,
            fontSize: 13,
            fontWeight: '400',
          }}
          data={hostoryData}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.CLR_D1CFD7,
              }}
            />
          )}
          renderItem={({item}) => (
            <RoyaltyPayCard
              name={item.username}
              payment={item.MypaymentMode}
              amount={item.Myamount}
              date={item.MyDate}
            />
          )}
        />
      </View>
    </View>
  );
};
export default RoyaltyPayoutHistory;
