import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import {incorpGetPaymentDetails} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';

const RequestPaymentDetails = props => {
  const [payments, setPayments] = useState([{item_name:'item_name1',amount:'99.00'},{item_name:'item_name2',amount:'99.00'},{item_name:'item_name3',amount:'99.00'},{item_name:'item_name4',amount:'99.00'},{item_name:'item_name5',amount:'99.00'},{item_name:'item_name6',amount:'99.00'},{item_name:'item_name7',amount:'99.00'}])
  const [total, setTotal] = useState(1000)
  const [hst, setHst] = useState(50)
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);


//   useEffect(() => {
//     setIsLoading(true)
//     const {incorporation_id, user_id} = global.incStatusData
//     const params = {User_id:user_id,Incorporation_Id:incorporation_id}
//     incorpGetPaymentDetails(params, (paymentDetailsRes) =>{
//       setIsLoading(false)
//       if(paymentDetailsRes?.status == 1){
//         setPayments(paymentDetailsRes?.data)
//         let f = 0
//         paymentDetailsRes?.data.map((item) =>{
//           f = f + (item.amount != null ? item.amount : 0)
//         })
//         setTotal(f)
//       }else{
//         const msg = paymentDetailsRes?.message ?? 'Something went wront, Please try again later.'
//         Alert.alert('SukhTax',msg)
//       }
//     })
//   }, [])

  
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1,
        paddingBottom:20
      }}>
      <AppHeader navigation = {navigation}/>
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="PAYMENTS" marginTop={100} />
        <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="PLEASE COMPLETE THE BELOW PAYMENT TO FINALIZE YOUR REGISTRATION REQUEST:"
      />
      {payments &&
          payments.map((item, index) => {
            if(item.item_name){
              return (
                <KeyValueView key = {item.item_name} marginTop={20} title={item.item_name} value={`$${item.amount}`} />
              );
            }
          })}
      <View
        style={{
          marginVertical: 20,
          height: 2,
          backgroundColor: Colors.CLR_00000020,
          width: '100%',
        }}
      />
        <KeyValueView marginTop={12} title='HST' value={`$${hst}`} />
      <KeyValueView marginTop={12} title="TOTAL" value={`$${total}`} />
        <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'PAY NOW'}
        onPress={() => {
          const nextPageParams = {payment_required:total}
          navigation.navigate('RequestPaymentScreen',{...nextPageParams})    
        }}
      />
      <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text
            style={{
              width: '60%',
              textAlign: 'center',
              color: Colors.BLACK,
              fontSize: 12,
              fontFamily: CustomFonts.OpenSansRegular,
            }}>
            DONT WORRY ALL PAYMENTS ARE SECURED
          </Text>
        </View>
    </ScrollView>
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
      <Text style={{fontWeight: '700', fontSize: 20, color: Colors.APP_BLUE_HEADING_COLOR}}>
        {props.title}
      </Text>
      <Text style={{fontWeight: '700', fontSize: 20, color: Colors.APP_BLUE_HEADING_COLOR}}>
        {props.value}
      </Text>
    </View>
  );
};

export default RequestPaymentDetails;
