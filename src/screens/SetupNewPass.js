import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
const back_arrow = require('../../assets/back_arrow.png');
const user = require('../../assets/user.png');
const header_logo = require('../../assets/header_logo.png');

const SetupNewPass = props => {
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Header />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          flex: 1,
        }}>
        <Heading value="NEW PASSWORD" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          fontWeight = '700'
          color={Colors.BLACK}
          value="ENTER A NEW PASSWORD ONE THAT
          YOU CAN REMEMBER"
        />
        <SKInput
          marginTop={48}
          marginBottom={0}
          leftAccImage={user}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Password'
          onEndEditing={value => {
            console.log('onEndEditing', value);
          }}
        />
        <SKInput
          leftAccImage={user}
          marginBottom={0}
          rightAccImage={user}
          onRightPressed={() => {
            console.log('onRightPressed');
          }}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Confirm Password'
          onEndEditing={value => {
            console.log('onEndEditing', value);
          }}
        />
        
        <SKButton
          fontSize={16}
          marginTop={31}
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
          title={'Submit'}
          onPress={() => {
            console.log('onPress');
          }}
        />
      </ScrollView>
    </View>
  );
};

const Header = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? 44 : 10,
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
        onPress={() => {
          props.onLeftPress && props.onLeftPress();
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 38,
            height: 38,
          }}
          source={header_logo}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SetupNewPass;
