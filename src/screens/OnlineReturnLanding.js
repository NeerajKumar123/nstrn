import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  DeviceEventEmitter,
  Keyboard,
  Platform,
  Text,
} from 'react-native';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {login} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const OnlineReturnLanding = props => {
  const selectedYears = [];
  const navigation = useNavigation();
  const [isFSelected, setIsFSelected] = useState(global.selectedYears && global.selectedYears.includes('2019'));
  const [isSSelected, setIsSSelected] = useState(global.selectedYears && global.selectedYears.includes('2020'));
  const [isTSelected, setIsTSelected] = useState(global.selectedYears && global.selectedYears.includes('2021'));

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="NEW ONLINE RETURN" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WHICH YEARS DO YOU WANT
          TO APPLY FOR? SELECT ALL
          THAT APPLY:"
        />
        <DocCard
          title={'2019'}
          isSelected={isTSelected}
          onSelected={() => {
            setIsTSelected(!isTSelected);
          }}
        />
        <DocCard
          title={'2020'}
          isSelected={isSSelected}
          onSelected={() => {
            setIsSSelected(!isSSelected);
          }}
        />
       
         <DocCard
          title={'2021'}
          isSelected={isFSelected}
          onSelected={() => {
            setIsFSelected(!isFSelected);
          }}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}>
          <SKButton
            fontSize={16}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'IDENTIFICATION'}
            onPress={() => {
              if (isFSelected) selectedYears.push('2021');
              if (isSSelected) selectedYears.push('2020');
              if (isTSelected) selectedYears.push('2019');
              if (isFSelected || isSSelected || isTSelected) {
                global.selectedYears = undefined
                global.selectedYears = selectedYears;
                const arr =   selectedYears?.sort(function(a, b) {
                  return parseInt(b) - parseInt(a);
                });
                global.mostRecentYear = arr?.[0] ?? '2020'        
                SKTStorage.setKeyValue('selectedYears',selectedYears,()=>{
                  navigation.navigate('Identification');
                })
              } else {
                Alert.alert('SukhTax', 'Please select year.');
              }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {title, isSelected = false, onSelected} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 48,
        borderRadius: 6,
        borderWidth:1,
        borderColor: Colors.CLR_E77C7E,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      key={`${Math.random()}`}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OnlineReturnLanding;
