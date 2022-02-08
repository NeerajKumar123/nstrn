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


const RoyaltyPayoutHistory = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState();
  const [hostoryData, setHostoryData] = useState();
  const [msg, setMsg] = useState();


  useEffect(() => {
    const {user_id} = global.onlineStatusData;
    const params = {User_Id: user_id};
    setIsLoading(true);
    getPayoutHistory(params, res => {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
      if (res?.status == 1) {
        setMsg(res?.message)
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
        height:'100%'
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
        {hostoryData?.length < 1 && msg &&
        <Text
        style={{
          fontSize: 15,
          marginTop:50,
          fontWeight: '500',
          color: Colors.GRAY,
          width: '100%',
          fontStyle:'italic'
        }}>
        {msg}
      </Text>
        }
        {hostoryData && 
        <FlatList
        style={{
          width: '100%',
          marginTop: 40,
          fontSize: 13,
          fontWeight: '400',
          height:'100%'
        }}
        data={hostoryData}
        ListHeaderComponent={() => 
          (hostoryData?.length > 0 ? <Header/> : null)
        }
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
            date={item?.added_on}
            amount={item?.amount}
          />
        )}
      />
        }
        
      </View>
    </View>
  );
};
export default RoyaltyPayoutHistory;


const Header = props => {

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        alignItems: 'center',
        width : "100%",
        height: 36,
        borderBottomColor:Colors.LIGHTGRAY,
        borderBottomWidth:3
      }}
      >
      <Text style={{color:Colors.CLR_232326, textAlign:'left',fontSize: 13,fontWeight:"400", opacity:.9}}>Date</Text>
      <Text style={{color:Colors.CLR_232326,textAlign:'right',fontSize: 15,fontWeight:"400",opacity:.9,marginRight:2}}>Amount</Text>
    </View>
  );
};