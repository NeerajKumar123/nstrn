import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';

const SKModel = props => {
  const {
    data = [{title: 'title'}, {title: 'title'}, {title: 'title'}],
    onSelect,
    onClose,
    title = 'Select',
    key
  } = props;
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={true}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#00000080',
        }}>
        <View
          style={{
            width: '90%',
            padding:10,
            paddingBottom:20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            overflow: 'hidden',
            shadowColor: Colors.LIGHTGRAY,
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowRadius: 3,
            shadowOpacity: 0.8,
            backgroundColor:'white'
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: CustomFonts.OpenSansRegular,
                fontSize: 15,
                textAlign: 'center',
                color:Colors.GRAY,
                textAlign:'center',
                width:'100%'
              }}>
              {title}
            </Text>
            <TouchableOpacity
            style = {{position:'absolute', right:0}}
              onPress={() => {
                onClose();
              }}>
              <Icon
                style={{marginRight: 0}}
                name={'close-circle-outline'}
                size={20}
                color={Colors.RED}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{width: '100%', marginTop:20}}
            data={data}
            renderItem={({item}) => (
              <Row
                item={item}
                key={key}
                onRowSelect={() => {
                  console.log('item===>', item);
                  onSelect(item);
                }}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const Row = props => {
  const {item,key,onRowSelect} = props;
  const displayValue = (key && item[key]) || item;
  return (
    <TouchableOpacity
    style = {{marginVertical:10}}
      onPress={() => {
        onRowSelect();
      }}
      >
      <Text
        style={{
          fontFamily: CustomFonts.OpenSansRegular,
          fontSize: 20,
          textAlign: 'center',
        }}>
        {displayValue}
      </Text>
    </TouchableOpacity>
  );
};

export default SKModel;
