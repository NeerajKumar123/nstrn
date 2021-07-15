import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton from '../components/SKButton';
const IncorpPayment = props => {
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
      <AppHeader navigation = {navigation}/>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="PAYMENTS" marginTop={100} />
        <PaymentFinalCard/>
        <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'PAY NOW'}
        onPress={() => {
          console.log('onPress');
          navigation.navigate('IncorpInProcess')
        }}
      />
    </ScrollView>
    </View>
  );
};

const PaymentFinalCard = props => {
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
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.CLR_D9272A}
        value="PLEASE COMPLETE THE BELOW PAYMENT TO FINALIZE YOUR REGISTRATION REQUEST:"
      />
      <KeyValueView marginTop={54} title="ONTARIO CORPORATION" value="$499" />
      <KeyValueView marginTop={12} title="NAMED CORPORATION" value="$100" />
      <View
        style={{
          marginVertical: 20,
          height: 2,
          backgroundColor: Colors.CLR_00000020,
          width: '100%',
        }}
      />
      <KeyValueView marginTop={12} title="TOTAL" value="$599" />
    </View>
  );
};
const KeyValueView = props => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: props.marginTop,
      }}>
      <Text style={{fontWeight: '700', fontSize: 20, color: Colors.CLR_29295F}}>
        {props.title}
      </Text>
      <Text style={{fontWeight: '700', fontSize: 20, color: Colors.CLR_29295F}}>
        {props.value}
      </Text>
    </View>
  );
};

export default IncorpPayment;
