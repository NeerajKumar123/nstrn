import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert, Platform, Linking} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton, {DarkBlueButton} from '../components/SKButton';

const CRAReply = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const {replies, title, cra_letters_status_name} = pageParams;
  console.log('pageParams', replies, title, cra_letters_status_name);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading value={'REPLY'} marginTop={50} />
        <Heading
          fontSize={18}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={title.toUpperCase()}
          marginTop={20}
        />
        <KeyValueView
          fontSize={18}
          title={'STATUS OF LETTER : '}
          value={cra_letters_status_name}
          marginTop={20}
          titleColor={Colors.APP_BLUE_HEADING_COLOR}
          subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
        />
        {replies &&
          replies.map((item, index) => {
            return (
              <Heading
                key={item.reply}
                fontSize={18}
                marginTop={12}
                fontWeight="700"
                color={Colors.APP_BLUE_HEADING_COLOR}
                value={item.reply}
              />
            );
          })}
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          iconcolor={Colors.WHITE}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
          title={'CRA HOME'}
          onPress={() => {
            navigation.navigate('CRALanding');
          }}
        />
      </View>
    </View>
  );
};

const KeyValueView = props => {
  const {
    marginTop = 0,
    titleColor = Colors.APP_BLUE_HEADING_COLOR,
    subtitleColor = Colors.APP_BLUE_HEADING_COLOR,
  } = props;
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: marginTop,
      }}>
      <Text style={{fontWeight: '700', fontSize: 18, color: titleColor}}>
        {props.title}
      </Text>
      <Text style={{fontWeight: '700', fontSize: 18, color: subtitleColor}}>
        {props.value}
      </Text>
    </View>
  );
};

export default CRAReply;
