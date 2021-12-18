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
import {getRefHistory} from '../apihelper/Api';

import RoyaltyRefCard from '../components/RoyaltyRefCard';

const DummyArray = [
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
const RoyaltyRefHistory = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [hostoryData, setHostoryData] = useState();

  useEffect(() => {
    const params = {Referral_Code:'REFCODE'}
    setIsLoading(true);
    getRefHistory(params, res => {
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
      {isLoading && <SKLoader/>}
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
          MY REFERRAL HISTORY
        </Text>

        <FlatList
          style={{
            width: '100%',
            marginTop: 40,
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
            <RoyaltyRefCard
              name={item.username}
              payment={item.MypaymentMode}
              amount={item.Myamount}
              Date={item.MyDate}
            />
          )}
        />
      </View>
    </View>
  );
};
export default RoyaltyRefHistory;
