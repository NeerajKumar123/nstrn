import React, {useState,useEffect} from 'react';
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
import {getTaxReturnsDocs} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const OnlineDocumentUploadV3 = props => {
  const selectedYears = [];
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);  
  const [isFSelected, setIsFSelected] = useState(global.selectedYears && global.selectedYears.includes('2019'));
  const [isSSelected, setIsSSelected] = useState(global.selectedYears && global.selectedYears.includes('2020'));
  const [isTSelected, setIsTSelected] = useState(global.selectedYears && global.selectedYears.includes('2021'));

  const years = global?.alreadyFliedYears
  const isFAlreadyFlied =  years && years.includes('2019')
  const isSAlreadyFlied = years && years.includes('2020')
  const isTAlreadyFlied = years && years.includes('2021')

  useEffect(() => {
    SKTStorage.setKeyValue('isLastDepHit',false, ()=>{})
  }, [])
  
  function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading  color value="DOCUMENT UPLOAD" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="Documents"
        />
        <DocCard
          title={'2019 Documents'}
          isFiled = {isFAlreadyFlied}
          isSelected={isFSelected}
          onSelected={() => {
            setIsFSelected(!isFSelected);
          }}
        />
        <DocCard
          title={'2020 Documents'}
          isFiled = {isSAlreadyFlied}
          isSelected={isSSelected}
          onSelected={() => {
            setIsSSelected(!isSSelected);
          }}
        />
       
         <DocCard
          title={'2021 Documents'}
          isFiled = {isTAlreadyFlied}
          isSelected={isTSelected}
          onSelected={() => {
            setIsTSelected(!isTSelected);
          }}
        />
        <DocCard
          title={'2022 Documents'}
          isFiled = {isTAlreadyFlied}
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
            title={'SUBMIT'}
            rightImage={CustomFonts.right_arrow}
            onPress={() => {
                navigation.goBack()
            //   if (isFSelected && !isFAlreadyFlied) selectedYears.push('2019');
            //   if (isSSelected && !isSAlreadyFlied) selectedYears.push('2020');
            //   if (isTSelected && !isTAlreadyFlied) selectedYears.push('2021');
            //   global.selectedYears = undefined
            //   global.selectedYears = selectedYears;
            //   const arr =   selectedYears?.sort(function(a, b) {
            //     return parseInt(b) - parseInt(a);
            //   });
            //   global.mostRecentYear = arr?.[0] ?? '2021'        
            //   if (global?.selectedYears?.length > 0) {
            //     const uniques = remove_duplicates_es6(global?.selectedYears);
            //     SKTStorage.setKeyValue('selectedYears',uniques,()=>{
            //       navigation.navigate('Identification');
            //     })
            //   } else {
            //     Alert.alert('SukhTax', 'Please select year.');
            //   }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {title, isSelected = false,isFiled = false, onSelected = ()=>{}} = props;
  return (
    <TouchableOpacity
      disabled = {isFiled}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 48,
        opacity: isFiled ?  .8 : 1,
        borderRadius: 6,
        borderWidth:1,
        borderColor:isFiled ? Colors.LIGHTGRAY: Colors.CLR_E77C7E,
        backgroundColor:isFiled ? Colors.WHITE :  isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      key={`${Math.random()}`}
      onPress={() => {
        onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: isFiled ?Colors.CLR_414141 : isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OnlineDocumentUploadV3;
