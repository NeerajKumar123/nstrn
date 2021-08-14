import React,{useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import {useNavigation} from '@react-navigation/native';

const Home = props => {
  const navigation = useNavigation();
  const userFullName = global.userInfo ? `${global.userInfo.firstname} ${global.userInfo.lastname}` : ''
  const {incorporation_status_id =  1 } = global.incStatusData
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation = {navigation}/>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="Home" marginTop={122} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`Welcome, ${userFullName}`}
        />
        <Heading
          fontSize={16}
          marginTop={25}
          color={Colors.APP_BLUE_HEADING_COLOR}
          value="RECENT REQUESTS"
        />
        <Heading
          fontSize={16}
          status={1}
          marginTop={15}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="TAX FILING"
          onClicked = {()=>{
            navigation.navigate('OnlineTaxFilingStatus')
          }}
        />
        <Heading
          fontSize={16}
          status={0}
          status={incorporation_status_id}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="INCORPORATION"
          onClicked = {()=>{
            navigation.navigate('IncorpApplyStatus')
          }}
        />
        <Heading
          fontSize={16}
          status={0}
          status={1}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="CRA LETTERS"
          onClicked = {()=>{
            return
            navigation.navigate('OnlineTaxFilingStatus')
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 46,
            justifyContent: 'space-between',
          }}>
          <ProfDoccCardView image={CustomFonts.profile} title="PROFILE" onClicked = {() =>{
            navigation.navigate('Profile')
          }}/>
          <ProfDoccCardView image={CustomFonts.request} title="DOCUMENTS" onClicked = {() =>{
            navigation.navigate('AllDocuments')
          }}/>
        </View>
        <MessegesView onClicked = {()=>{
          navigation.navigate('Messages')
        }} />
      </ScrollView>
    </View>
  );
};

const ProfDoccCardView = props => {
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.APP_RED_SUBHEADING_COLOR, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '48%',
        height: 100,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 48,
            height: 48,
          }}
          source={props.image}
        />
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '800',
            marginTop: 5,
            fontFamily:CustomFonts.OpenSansRegular
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const MessegesView = props => {
  const {new_message_count = 0} = global.onlineStatusData;
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.APP_RED_SUBHEADING_COLOR, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 90,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
              fontFamily:CustomFonts.OpenSansRegular
            }}>
            MESSAGES :
          </Text>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
              fontFamily:CustomFonts.OpenSansRegular
            }}>
            {`${new_message_count} NEW MESSAGES`}
          </Text>
        </View>
        <Image
          resizeMode="contain"
          style={{
            width: 42,
            height: 38,
          }}
          source={CustomFonts.messeges}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Home;
