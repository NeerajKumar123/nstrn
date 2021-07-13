import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const MyTaxYear = props => {
  const navigation = useNavigation()
  const data = [{title:'I WAS EMPLOYED'},{title:'I DROVE UBER/LYFT ETC.'},{title:'I OWNED A RENTAL PROPERTY'},{title:'I HAD OTHER SELF EMPLOYMENT INCOME'},{title:'I PAID RENT AND HAVE RENT RECEIPTS'}]
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height:'100%',
      }}>
      <AppHeader navigation = {navigation} />
      <ScrollView
        style={{width: '100%', marginBottom:50}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          marginBottom:50
        }}>
        <Heading value="MY TAX YEAR" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="LETS HAVE A LOOK AT HOW YOUR TAX YEAR 2018 WENT!"
        />
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="PLEASE SELECT ALL THAT APPLY"
        />
        <DocOptionCard
            height = {56}
            bgColor = {Colors.CLR_29295F}
            item= {{title:"MY SELF"}}
        />
       {data &&
        data.map((item, index) => {
          return (
            <DocOptionCard
              item={item}
              bgColor = {Colors.CLR_29295F}
              onSelected={() => {
                  console.log('data',item)
              }}
            />
          );
        })}
        <SKButton
          marginTop = {30}
          fontSize={16}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'DOCUMENTS'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('OnlineDocuments');
          }}
        />
      </ScrollView>
    </View>
  );
};

const DocOptionCard = props => {
    const {item, height = 44, fontSize=15} = props
  return (
      <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        alignItems:'center',
        width: '100%',
        height: height,
        backgroundColor:props.bgColor
      }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: fontSize,
            fontWeight: '700',
          }}>
          {item.title}
        </Text>
      </TouchableOpacity>
  );
};

export default MyTaxYear;
