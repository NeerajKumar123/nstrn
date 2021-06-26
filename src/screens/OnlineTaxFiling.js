import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton from '../components/SKButton';
const upload = require('../../assets/upload.png');
const messeges = require('../../assets/messeges.png');
const OnlineTaxFiling = props => {
  const [isPaynow, setIsPaynow] = useState(false);
  const [status, setStatus] = useState(3);
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="ONLINE TAX FILING" marginTop={124} />
        {status < 3 && (
          <TaxFilingStatusCard
            status={status}
            marginTop={25}
            title="2018 TAX RETURN"
            onClick={() => {
              console.log('2018 TAX RETURN');
            }}
          />
        )}
        {status >= 3 && !isPaynow && (
          <PaymentStatusCard
            detailsClicked={() => {
              setIsPaynow(true);
            }}
          />
        )}
        {status >= 3 && isPaynow && <PaymentFinalCard />}
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
      <>
        <View
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            marginTop: 16,
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.CLR_F58080}
            borderColor={Colors.CLR_EB0000}
            title={'DETAILS'}
            onPress={() => {
              console.log('onPress');
              props.detailsClicked && props.detailsClicked();
            }}
          />
        </View>
        <SKButton
          marginTop={16}
          fontSize={16}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
          title={'PAY SECURELY'}
          onPress={() => {
            console.log('onPress');
          }}
        />
      </>
    </View>
  );
};
const PaymentFinalCard = props => {
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
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.CLR_D9272A}
        value="BASED ON YOUR REQUIREMENTS, WE HAVE ASSESSED YOUR FEE TO "
      />
      <KeyValueView marginTop={54} title="2020 TAX RETURN" value="$45" />
      <KeyValueView marginTop={12} title="T-SLIPS x 5" value="$25" />
      <KeyValueView marginTop={12} title="UBER" value="$100" />
      <View
        style={{
          marginVertical: 20,
          height: 2,
          backgroundColor: Colors.CLR_00000020,
          width: '100%',
        }}
      />
      <KeyValueView title="TOTAL" value="$170" />
      <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.CLR_EB0000}
        borderColor={Colors.CLR_F58080}
        title={'PAY NOW'}
        onPress={() => {
          console.log('onPress');
        }}
      />
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
const TaxFilingStatusCard = props => {
  const {status} = props;
  let statusText = '';
  if (status == 1) {
    statusText = 'FILE SUBMITTED';
  } else {
    statusText = 'MISSING DOCUMENTS';
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
        THANK YOU FOR SUBMITTING YOUR FILE. WE ARE WORKING HARD TO REVIEW YOUR
        INFORMATION AND DOCUMENTS. WE WILL PROVIDE YOU WITH A PAYMENT QUOTE
        SHORTLY.
      </Text>
      {status == 2 && (
        <TouchableOpacity
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
      <MessegesView />
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
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.CLR_F58080}
          title={'EDIT INFO'}
          onPress={() => {
            console.log('onPress');
          }}
        />
        <SKButton
          fontSize={16}
          width="48%"
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_F58080}
          borderColor={Colors.CLR_EB0000}
          title={'Continue'}
          onPress={() => {
            console.log('onPress');
          }}
        />
      </View>
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
          props.onLeftPress && props.onLeftPress();
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
