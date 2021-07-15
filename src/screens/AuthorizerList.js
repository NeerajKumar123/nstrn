import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as CustomFonts from '../constants/FontsDefs'
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';

const AuthorizerList = props => {
  const navigation = useNavigation()
  const data = [{title:'TAXPAYER 1'},{title:'TAXPAYER 2'},{title:'TAXPAYER 3'}]
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
        style={{width: '100%', marginBottom:100}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom:10
        }}>
        <Heading value="AUTHORIZE US PLEASE" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="WE WILL NEED YOU TO AUTHORIZE US IN ORDER FOR US TO PULL YOUR INFORMATION FROM CRA!"
        />
       {data &&
        data.map((item, index) => {
          return (
            <Card
              item={item}
              onSelected={() => {
                  console.log('data',item)
              }}
            />
          );
        })}
        <SKButton
        marginTop = {30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'ANYTHING ELSE'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('AnyThingElse');
          }}
        />
      </ScrollView>
    </View>
  );
};

const Card = props => {
    const {item, height = 44, fontSize=15} = props
  return (
      <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        paddingVertical:5,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        alignItems:'center',
        width: '100%',
        minHeight: height,
        backgroundColor:Colors.CLR_29295F,
      }}>
        <Text
          style={{
            textAlign: 'left',
            color: Colors.WHITE,
            fontSize: fontSize,
            fontWeight: 'bold',
            fontFamily:CustomFonts.OpenSansRegular,
          }}>
          {item.title}
        </Text>
      </View>
  );
};

export default AuthorizerList;
