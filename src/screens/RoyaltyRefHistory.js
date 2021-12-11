import React, { useState, useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    Image,
    FlatList,
    Alert,
    Button
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import { useNavigation } from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import { ST_REGEX } from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import RoyaltyRefCard from '../components/RoyaltyRefCard'

const DummyArray = [{ username: "neeshu", MypaymentMode: "online11", Myamount: "$5" },
{ username: "neeshu", MypaymentMode: "online3", Myamount: "$5" },
{ username: "neeshu", MypaymentMode: "online", Myamount: "$5" },
{ username: "neeshu", MypaymentMode: "online", Myamount: "$5" },
{ username: "neeshu", MypaymentMode: "online", Myamount: "$5" },
{ username: "neeshu", MypaymentMode: "online", Myamount: "$5" },
{ username: "neeshu", MypaymentMode: "online", Myamount: "$5" }]
const RoyaltyRefHistory = () => {
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
            <View style = {{
                paddingHorizontal : 16,
                flexDirection : "column",
                alignItems : "center",
                width : "100%",
                marginTop : 25
            }}>
            <Text style={{
                fontSize: 25,
                fontWeight: "bold",
               
                width: "100%"
            }}>
                MY REFERRAL HISTORY
            </Text>



            <FlatList 
            style = {{
               
                width :  "100%",
                marginTop: 60
            }}

                data={DummyArray}
                ItemSeparatorComponent={() => (
                    <View style={{width:"100%",height: 10}} />
                  )}
                renderItem={({ item }) => (
                    <RoyaltyRefCard name = {item.username} payment = {item.MypaymentMode}  amount = {item.Myamount} />)}
            />

            <SKButton
                fontSize={16}
                width="100%"
                fontWeight={'normal'}
                backgroundColor={Colors.PRIMARY_FILL}
                borderColor={Colors.SECONDARY_FILL}
                title={'NEXT'}
                onPress={() => {
                    navigation.navigate('RoyaltyPayment')
                }}
            /> 
            </View>

            

        </View>
    )
}
export default RoyaltyRefHistory;

