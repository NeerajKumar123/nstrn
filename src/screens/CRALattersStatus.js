import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert, Platform, Linking} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton, {DarkBlueButton} from '../components/SKButton';
import {craLattersGetDetails} from '../apihelper/Api';

const CRALattersStatus = props => {
  const navigation = useNavigation();
  const [status, setStatus] = useState(1)
  const [details, setDetails] = useState()



  useEffect(() => {
    const {user_id, cra_letters_id} = global.craLattersData
    const params = {User_Id:user_id,CRA_Letter_Id:cra_letters_id}
    craLattersGetDetails(params, (detailsRes) =>{
      console.log('detailsRes',detailsRes)
      if (detailsRes?.status == 1) {
        const data = detailsRes?.data?.length > 0 ? detailsRes?.data[0] : {}
        console.log('data',data)
        setDetails(data)
        setStatus(data.cra_letters_status_id)
      }
    })
  }, [])


  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
          paddingBottom: Platform.OS == 'ios' ? 100 : 0,
        }}>
        {status == 1 && <InProcess details = {details} navigation={navigation} marginTop={25} />}
        {status == 2 && <Rejected details = {details} navigation={navigation} />}
        {status == 3 && <Resolved details = {details} navigation={navigation} />}
      </ScrollView>
    </View>
  );
};

const InProcess = props => {
  const {navigation, details} = props;
  const {cra_letters_status_name,status_description,title} = details
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        paddingHorizontal: 20,
      }}>
      <Heading value={'CRA LATTER'} marginTop={50} />
      <Heading
        fontSize={20}
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value={title}
        marginTop={20}
      />
      <KeyValueView
        fontSize={20}
        title={'STATUS OF LETTER : '}
        value={cra_letters_status_name}
        marginTop={20}
        titleColor={Colors.APP_BLUE_HEADING_COLOR}
        subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
      />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_BLUE_HEADING_COLOR}
        value={status_description}
      />
      <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        iconcolor={Colors.WHITE}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'CRA HOME'}
        onPress={() => {
            navigation.navigate('CRALanding')
        }}
      />
    </View>
  );
};

const Rejected = props => {
    const {navigation} = props;
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading value={'CRA LATTER'} marginTop={50} />
        <Heading
          fontSize={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={'LETTER TITLE'}
          marginTop={20}
        />
        <KeyValueView
          fontSize={20}
          title={'STATUS OF LETTER : '}
          value={'REJECTED'}
          marginTop={20}
          titleColor={Colors.APP_BLUE_HEADING_COLOR}
          subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
        />
        <Heading
          fontSize={17}
          marginTop={12}
          fontWeight="700"
          color={Colors.APP_BLUE_HEADING_COLOR}
          value={'status_description'}
        />
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          iconcolor={Colors.WHITE}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
          title={'CRA HOME'}
          onPress={() => {
              navigation.navigate('CRALanding')
          }}
        />
      </View>
    );
  };

  const Resolved = props => {
    const {navigation} = props;
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading value={'CRA LATTER'} marginTop={50} />
        <Heading
          fontSize={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={'LETTER TITLE'}
          marginTop={20}
        />
        <KeyValueView
          fontSize={20}
          title={'STATUS OF LETTER : '}
          value={'IN PROCESS'}
          marginTop={20}
          titleColor={Colors.APP_BLUE_HEADING_COLOR}
          subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
        />
        <Heading
          fontSize={17}
          marginTop={12}
          fontWeight="700"
          color={Colors.APP_BLUE_HEADING_COLOR}
          value={'status_description'}
        />
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          iconcolor={Colors.WHITE}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
          title={'SUKH TAX REPLY'}
          onPress={() => {
              navigation.navigate('CRAReply')
          }}
        />
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          iconcolor={Colors.WHITE}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
          title={'ATTACHMENTS'}
          onPress={() => {
              navigation.navigate('CRAAttachments')
          }}
        />
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          iconcolor={Colors.WHITE}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
          title={'CRA HOME'}
          onPress={() => {
              navigation.navigate('CRALanding')
          }}
        />
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
      <Text style={{fontWeight: '700', fontSize: 20, color: titleColor}}>
        {props.title}
      </Text>
      <Text style={{fontWeight: '700', fontSize: 20, color: subtitleColor}}>
        {props.value}
      </Text>
    </View>
  );
};

export default CRALattersStatus;
