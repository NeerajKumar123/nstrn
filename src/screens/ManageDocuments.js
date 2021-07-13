import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as CustomFonts from '../constants/FontsDefs'
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');

const ManageDocuments = props => {
  const navigation = useNavigation()
  const data = [{title:'Uploaded file 1'},{title:'Uploaded file 2'},{title:'Uploaded file 3'},{title:'Uploaded file 4'},{title:'Uploaded file 5'}]
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height:'100%',
      }}>
      <AppHeader navigation = {navigation}/>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom:10
        }}>
        <Heading value="MANAGE DOCUMENTS" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="SEE BELOW FOR ALL DOCUMENTS UPLOADED"
        />
       {data &&
        data.map((item, index) => {
          return (
            <ManageDocCard
              item={item}
              onSelected={() => {
                  console.log('data',item)
              }}
            />
          );
        })}
        <SKButton
          fontSize={16}
          marginTop = {30}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'AUTHORIZATION'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('AuthorizerList');
          }}
        />
      </ScrollView>
    </View>
  );
};

const ManageDocCard = props => {
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
        backgroundColor:Colors.WHITE,
        elevation:2,
        backgroundColor: Colors.WHITE,
        shadowColor: Colors.LIGHTGRAY,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.8,
      }}>
        <Text
          style={{
            textAlign: 'left',
            color: Colors.CLR_29295F,
            fontSize: fontSize,
            fontWeight: '500',
            fontFamily:CustomFonts.OpenSansRegular,
          }}>
          {item.title} {item.title} {item.title} {item.title} {item.title} {item.title} {item.title} {item.title} {item.title} {item.title}
        </Text>
          <TouchableOpacity>
          <Icon style = {{marginRight:0, }} name= {'close-circle-outline'} size={30} color = {Colors.RED} />
              </TouchableOpacity>

      </View>
  );
};

export default ManageDocuments;
