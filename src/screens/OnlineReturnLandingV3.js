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
import {onlineGetTaxFileStatus} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const OnlineReturnLandingV3 = props => {
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
  const [statusDetails, setStatusDetails] = useState({});  


  useEffect(() => {
    SKTStorage.setKeyValue('isLastDepHit',false, ()=>{})
    const {user_id, tax_file_id} = global.onlineStatusData
    if(tax_file_id > 0 && user_id){
      const params = {User_Id:user_id, Tax_File_Id:tax_file_id}
      onlineGetTaxFileStatus(params,res => {
        console.log('res',JSON.stringify(res))
        if (res?.status == 1) {
          setStatusDetails(res.data[0])
        }
      });
    }
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
        <Heading value="NEW ONLINE RETURN" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WELCOME TO THE SUKH TAX ONLINE FILING
          CENTRE. WE BELIEVE TAX FILING SHOULD BE
          EASY AND STRESS FREE."
        />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="PLEASE FOLLOW OUR 3 STEP APPROACH
          BELOW TO SUBMIT YOUR FILE AND WE WILL
          TAKE CARE OF THE REST."
        />
        <OnlineLandinButton
          title={'Complete or review profile'}
          isSelected={statusDetails?.tax_profile_completed}
          onSelected={() => {
            console.log('OnlineCompleteReviewProfileV3OnlineCompleteReviewProfileV3')
            navigation.navigate("OnlineCompleteReviewProfileV3")
          }}
        />
        <OnlineLandinButton
          title={'Select which years to file for'}
          isSelected={statusDetails?.years_selected}
          onSelected={() => {
            navigation.navigate("OnlineSelectYearV3")
          }}
        />
       
         <OnlineLandinButton
          title={'Upload documents'}
          isSelected={statusDetails?.document_uploaded}
          onSelected={() => {
            navigation.navigate("OnlineDocumentUploadV3")
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
            title={'SUBMIT YOUR FILE'}
            rightImage={CustomFonts.right_arrow}
            onPress={() => {
              if (isFSelected && !isFAlreadyFlied) selectedYears.push('2019');
              if (isSSelected && !isSAlreadyFlied) selectedYears.push('2020');
              if (isTSelected && !isTAlreadyFlied) selectedYears.push('2021');
              global.selectedYears = undefined
              global.selectedYears = selectedYears;
              const arr =   selectedYears?.sort(function(a, b) {
                return parseInt(b) - parseInt(a);
              });
              global.mostRecentYear = arr?.[0] ?? '2021'        
              if (global?.selectedYears?.length > 0) {
                const uniques = remove_duplicates_es6(global?.selectedYears);
                SKTStorage.setKeyValue('selectedYears',uniques,()=>{
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

const OnlineLandinButton = props => {
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
        borderColor:isFiled ? Colors.LIGHTGRAY: Colors.LIGHTGRAY,
        backgroundColor:isFiled ? Colors.CLR_FFECEC:  Colors.CLR_FFECEC,
      }}
      key={`${Math.random()}`}
      onPress={() => {
        console.log('OnlineCompleteReviewProfileV3')
        onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: isFiled ?Colors.CLR_191919 : Colors.CLR_191919,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {title}
      </Text>
      <Icon
        style={{right: 20, position: 'absolute'}}
        name={isSelected ? CustomFonts.CheckRightFilled : CustomFonts.CheckRight}
        size={isSelected ? 20 : 20}
        color={isSelected ? Colors.GREEN : Colors.GRAY}
      />
    </TouchableOpacity>
  );
};

export default OnlineReturnLandingV3;
