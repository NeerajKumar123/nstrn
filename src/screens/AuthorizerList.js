import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image, Alert} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';
import {onlineFinalizeAuthorization} from '../apihelper/Api';

const AuthorizerList = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
  }, [isFocused]);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%', marginBottom: 100}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}>
        <Heading value="AUTHORIZE US PLEASE" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE WILL NEED YOU TO AUTHORIZE US IN ORDER FOR US TO PULL YOUR INFORMATION FROM CRA!"
        />
        <Card
          title={'TAX PAYER 1'}
          isAuthorized={global.isFAuthorized}
          onSelected={() => {
            navigation.navigate('SignaturePage', {authIndex: 0});
          }}
        />
        {global.isFromSpouseFlow && 
        <Card
        title={'TAX PAYER 2'}
        isAuthorized={global.isSAuthorized}
        onSelected={() => {
          navigation.navigate('SignaturePage', {authIndex: 1});
        }}
      />
        }
        <SKButton
          marginTop={30}
          disable={!global.isAuthorized}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'ANYTHING ELSE'}
          onPress={() => {
            const {user_id,tax_file_id} = global.onlineStatusData
            onlineFinalizeAuthorization({User_Id:user_id,Tax_File_Id:tax_file_id},(res) =>{
              if (res.status == 1) {
                navigation.navigate('AnyThingElse');
              }else{
                Alert.alert('Sukhtax', 'Something went wrong.')
              }
            } )
          }}
        />
      </ScrollView>
    </View>
  );
};

const Card = props => {
  const {
    title,
    height = 44,
    fontSize = 15,
    onSelected,
    isAuthorized = false,
  } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        onSelected && onSelected();
      }}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        paddingVertical: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
        minHeight: height,
        backgroundColor: Colors.APP_BLUE_HEADING_COLOR,
      }}>
      <Text
        style={{
          textAlign: 'left',
          color: Colors.WHITE,
          fontSize: fontSize,
          fontWeight: 'bold',
          fontFamily: CustomFonts.OpenSansRegular,
        }}>
        {title}
      </Text>
      <Icon
        style={{right: 20, position: 'absolute'}}
        name={isAuthorized ? CustomFonts.CheckRight : CustomFonts.ChevronRight}
        size={isAuthorized ? 20 : 30}
        color={Colors.WHITE}
      />
    </TouchableOpacity>
  );
};

export default AuthorizerList;
