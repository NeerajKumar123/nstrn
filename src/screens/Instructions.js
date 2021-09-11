import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'

const Instructions = props => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
      }}>
      <AppHeader navigation={navigation}/>
      <View style={{marginTop: 50}}>
        <Image
          resizeMode="contain"
          style={{width: 136, height: 150}}
          source={CustomFonts.header_logo}
        />
      </View>
      <View style={{marginTop: 47, width:'100%',  paddingHorizontal:20}}>
        <Heading
          fontSize={25}
          value="FIRST TIME ?"
          marginTop={0}
          textWidth = '100%'
          textAlign = 'left'
        />
        <Heading
          marginTop={30}
          fontSize={22.31}
          textWidth = '100%'
          textAlign = 'left'
          value="DONT WORRY WE HAVE GOT YOU COVERED."
        />
        <Heading
          marginTop={38}
          fontSize={22}
          textWidth = '100%'
          textAlign = 'left'
          value="PLEASE HIT THE NEXT BUTTON TO START WITH SOME BASIC INFORMATION"
        />
      </View>
      <TouchableOpacity
      onPress = {() =>{
        navigation.navigate('SignUp')
      }}
        style={{
          backgroundColor: Colors.APP_RED_SUBHEADING_COLOR,
          borderRadius: 28,
          width: 56,
          height: 56,
          borderWidth: 2,
          borderColor: Colors.CLR_F47F7F,
          justifyContent: 'center',
          alignItems: 'center',
          position:'absolute',
          right:10,
          bottom:10
        }}>
        <Image
          resizeMode="contain"
          style={{width: 12, height: 25}}
          source={CustomFonts.right_arrow}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Instructions;
