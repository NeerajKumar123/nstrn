import {
  View,
  Image,
  Text,
} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const InstCard = props => {
  const {text,padtype = 2} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
      }}>
        <View style = {{justifyContent:'center', alignItems:'center'}}>
        <View style = {{backgroundColor:(padtype == 2 || padtype == 3) && padtype != 1  ? Colors.PRIMARY_FILL : Colors.WHITE, flex:1, width:1}}/>
          <Icon
            name={'check-circle'}
            size={25}
            color={Colors.PRIMARY_FILL}
            style = {{width:25, height:25}}
          />
          { <View style = {{backgroundColor:(padtype == 1 || padtype == 2) && padtype != 3 ? Colors.PRIMARY_FILL : Colors.WHITE, flex:1,width:1}}/>}
        </View>
      <Text
        style={{
          color: Colors.CLR_29295F,
          fontSize: 16,
          fontWeight: '400',
          marginLeft: 20,
          marginTop : (padtype == 2 || padtype == 3) && padtype != 1 ?  10: 0,
          marginBottom : (padtype == 1 || padtype == 2) && padtype != 3 ? 10 : 0,
          flex:1,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default InstCard;
