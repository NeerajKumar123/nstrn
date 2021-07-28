import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton from '../components/SKButton';

const PaymentAwaiting = props => {
  const [isPaynow, setIsPaynow] = useState(false);
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
        <PaymentStatusCard />
        <View
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 16,
            flexDirection: 'row',
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'DETAILS'}
            onPress={() => {
              console.log('onPress');
              props.detailsClicked && props.detailsClicked();
            }}
          />
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'PAY SECURELY'}
            onPress={() => {
              console.log('onPress');
              navigation.navigate('HomePayment');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const PaymentStatusCard = props => {
  let statusText = 'PAYMENT AWAITING';
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
      <Heading
        fontSize={20}
        marginTop={35}
        fontWeight="700"
        color={Colors.CLR_29295F}
        value="TOTAL AMOUNT : 50.00$"
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
        WE HAVE ASSESSED YOUR INFORMATION AND DETERMINED YOUR FEE TO BE $50.00
        PLEASE PROCEED TO PAYMENT BELOW
      </Text>
    </View>
  );
};

export default PaymentAwaiting;
