import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const right_arrow = require('../../assets/right_arrow.png');

const HSTRegistration = props => {
  const navigation = useNavigation();

  const data = [{name: 'YES (FREE OF CHARGE)'}, {name: 'NO'}];
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="FINAL STEP" marginTop={122} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="AUTHORIZATION"
        />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="WE NEED YOUR
          AUTHORIZATION TO COMPLETE
          THE INCORPORATION PROCESS"
        />
        {data &&
          data.map((item, index) => {
            return (
              <DocCard
                item={item}
                onSelected={() => {
                  console.log('data', item);
                }}
              />
            );
          })}
        <SKButton
          marginTop={30}
          fontSize={16}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'NEXT'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('IncorpPayment');
          }}
        />
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 48,
        borderRadius:6,
        backgroundColor:Colors.CLR_7F7F9F
      }}
      onPress={() => {
        props.onClicked && props.onClicked();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.WHITE,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default HSTRegistration;
