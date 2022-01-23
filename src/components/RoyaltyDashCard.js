import React from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
const {width} = Dimensions.get('window');
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import * as CustomFonts from '../constants/FontsDefs';
const arrow_dash = require('../../assets/tab/arrow_dash.png');
const RoyaltyDashCard = props => {
  const {title, desc, status = undefined, onClick = () => {}, marginTop = 0, marginBotton = 0} = props;
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        elevation: 5,
        shadowColor: Platform.OS == 'ios' ? Colors.CLR_E0BDBE: Colors.CLR_E0BDBE,
        shadowOffset: {width: 3, height: 3},
        shadowOpacity: Platform.OS  == 'ios' ?  .5 : 1.0,
        shadowRadius: 3,
        borderRadius: 10,
        padding: 16,
        marginTop:marginTop,
        marginBottom:marginBotton,
        backgroundColor:Colors.CLR_FFFFFF,
        height: 93
      }}
      onPress={() => {
        onClick()
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          
          }}>
        <Text
          style={{
            color: Colors.CLR_B52835,
            fontSize: 17,
            fontWeight: '900'
            }}>
         {title}
        </Text>
        <Image
          resizeMode="contain"
          style={{width: 16, height: 16}}
          source={arrow_dash}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems:'flex-end',
          marginTop: 5,          
        }}>
        <Text
          style={{
            color: Colors.CLR_B52835,
            fontSize: 15,
            fontWeight: '700',
           }}>
          {desc}
        </Text>
        {status && 
         <View style = {{flexDirection:'column', justifyContent:'center', alignItems:'flex-end'}}>
         <Text
           style={{
             color: Colors.CLR_5F5F94,
             fontSize: 15,
             fontWeight: '400',
           }}>
           STATUS
         </Text>
         <Text
           style={{
             color: Colors.APP_RED_SUBHEADING_COLOR,
             fontSize: 15,
             fontWeight: '600',
           }}>
           {status}
         </Text>
       </View>
        }
      </View>
    </TouchableOpacity>
  );
};

export default RoyaltyDashCard;
