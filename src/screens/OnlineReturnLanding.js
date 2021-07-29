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
  const [isFSelected, setIsFSelected] = useState(false);
  const [isSSelected, setIsSSelected] = useState(false);
  const [isTSelected, setIsTSelected] = useState(false);

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
          title={'2021'}
          isSelected={isFSelected}
          onSelected={() => {
            setIsFSelected(!isFSelected);
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
          title={'2019'}
          isSelected={isTSelected}
          onSelected={() => {
            setIsTSelected(!isTSelected);
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
                console.log('onPress,', selectedYears);
                global.selectedYears = selectedYears;
                navigation.navigate('CarryForward');
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
        backgroundColor: isSelected ? Colors.PRIMARY_FILL : Colors.CLR_7F7F9F,
      }}
      key={`${Math.random()}`}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OnlineReturnLanding;
