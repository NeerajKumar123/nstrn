import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton from '../components/SKButton';
const upload = require('../../assets/upload.png');
const messeges = require('../../assets/messeges.png');
const OnlineTaxFiling = props => {
  const [status, setStatus] = useState(1);
  const navigation = useNavigation();
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
        }}>
        <Heading value="ONLINE TAX FILING" marginTop={124} />
        <TaxFilingStatusCard
          status={status}
          marginTop={25}
          title="2018 TAX RETURN"
          onClick={() => {
            setStatus(2);
          }}
        />
        <MessegesView
          onClick={() => {
            navigation.navigate('Messages');
          }}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'EDIT INFO'}
            onPress={() => {
              console.log('onPress');
            }}
          />
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'Continue'}
            onPress={() => {
              console.log('onPress');
              navigation.navigate('PaymentAwaiting');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const TaxFilingStatusCard = props => {
  const {status} = props;
  let statusText = '';
  let descText = '';
  if (status == 2) {
    statusText = 'FILE SUBMITTED';
    descText =
      'THANK YOU FOR SUBMITTING YOUR FILE. WE ARE WORKING HARD TO REVIEW YOUR INFORMATION AND DOCUMENTS. WE WILL PROVIDE YOU WITH A PAYMENT QUOTE SHORTLY.';
  } else {
    statusText = 'MISSING DOCUMENTS';
    descText =
      'THANK YOU FOR SUBMITTING YOUR INFORMATION. LOOKS LIKE YOU STILL HAVE TO UPLOAD YOUR DOCUMENTS.PLEASE USE THE BUTTON BELOW TO UPLOAD';
  }
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: props.marginTop,
      }}
      onPress={() => {
        props.onClick && props.onClick();
      }}>
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.CLR_D9272A}
        value="STATUS OF FILE :"
      />
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.CLR_29295F}
        value={statusText}
        marginTop={2}
      />
      <Text
        style={{
          textAlign: 'left',
          color: Colors.BLACK,
          fontSize: 17,
          width: '100%',
          fontWeight: '400',
          marginTop: 30,
        }}>
        {descText}
      </Text>
      {status == 1 && (
        <TouchableOpacity
          onPress={() => {
            props.onClick();
          }}
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 11,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: Colors.CLR_29295F,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderRadius: 6,
            marginTop: 35,
          }}>
          <Text>UPLOAD THE MISSING DOC HERE</Text>
          <Image
            resizeMode="contain"
            style={{width: 24, height: 24}}
            source={upload}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const MessegesView = props => {
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.CLR_D9272A, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 50,
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
          props.onClick && props.onClick();
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
            }}>
            2 NEW MESSAGES
          </Text>
        </View>
        <Image
          resizeMode="contain"
          style={{
            width: 42,
            height: 38,
          }}
          source={messeges}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OnlineTaxFiling;
