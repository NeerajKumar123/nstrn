import React from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('window');
import * as Colors from '../constants/ColorDefs';

const tab_home = require('../../assets/tab/tab_home.png');
const tab_document = require('../../assets/tab/tab_document.png');
const tab_msg = require('../../assets/tab/tab_msg.png');
const tab_account = require('../../assets/tab/tab_account.png');

const tabConfigs = [
  {
    tabName: 'Home',
    icon: tab_home,
  },
  {
    tabName: 'Docum',
    icon: tab_document,
  },
  {
    tabName: 'Messa',
    icon: tab_msg,
  },
  {
    tabName: 'Acco',
    icon: tab_account,
  },
];

const BottomTab = props => {
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        width: '100%',
        flexDirection: 'row',
        alignItems: Platform.OS == 'ios' ? 'flex-end' : 'flex-end',
        elevation:5
      }}>
     <View
      style={{
        backgroundColor: Colors.WHITE,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-around',
        height:70,
        paddingHorizontal:10,
        shadowColor: 'gray',
      shadowOffset: { width: 0, height: -3},
      shadowOpacity: 0.5,
      shadowRadius: 1,  
      paddingTop:10
      }}>
      {tabConfigs &&
        tabConfigs.map((item, index) => {
          let customStyle = {}
          if(index == 0){
            customStyle = {
            }
          }
          return (
            <Tab
              key={item.tabName}
              item={item}
              disabled = {item.tabName == 'Home'}
              customStyle = {customStyle}
              textcolor = {index == 0 ?  Colors.CLR_14273E : Colors.WHITE}
              isSelected={props.selectedIndex == index + 1 ? true : false}
              onSelected={() => {
                props.onTabSelected(index + 1);
              }}
            />
          );
        })}
    </View>
    </View>
    
  );
};

const Tab = props => {
  const {item, isSelected, customStyle,disabled,textcolor} = props;
  const commonStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isSelected
      ? Colors.CLR_RGBA100159221023
      : Colors.WHITE,
    flexDirection: 'column',
    height: 50,
    width:50,
  }

  return (
    <TouchableOpacity
      disabled = {disabled}
      onPress={() => {
        props.onSelected();
      }}
      key={item.tabName}
      style={[commonStyle, customStyle]}>
      <Image
        resizeMode="contain"
        style={{width: 27, height: 27}}
        source={item.icon}
      />
      {/* <Text
          style={{
            width:'100%',
            textAlign:'center',
            color: Colors.CLR_14273E || textcolor,
            fontSize: 11,
            marginTop:10,
          }}>
          {item.tabName}
        </Text> */}
    </TouchableOpacity>
  );
};

export default BottomTab;
