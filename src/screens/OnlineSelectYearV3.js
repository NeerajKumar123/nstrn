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
import {onlineSaveSelectedYears} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const OnlineSelectYearV3 = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const {statusDetails} = pageParams
  const [isLoading, setIsLoading] = useState(false);  
  const [isFSelected, setIsFSelected] = useState(statusDetails.years_selected?.includes(new Date().getFullYear() - 1));
  const [isSSelected, setIsSSelected] = useState(statusDetails.years_selected?.includes(new Date().getFullYear() - 2));
  const [isTSelected, setIsTSelected] = useState(statusDetails.years_selected?.includes(new Date().getFullYear() - 3));
  const [isFTSelected, setIsFTSelected] = useState(statusDetails.years_selected?.includes(new Date().getFullYear() - 4));

  const {tax_file_status_id} = statusDetails || {}
  const allowYearsEditing  = tax_file_status_id == 8

  const isFAlreadyFlied = allowYearsEditing ? false : statusDetails.years_selected?.includes(new Date().getFullYear() - 1)
  const isSAlreadyFlied = allowYearsEditing ? false : statusDetails.years_selected?.includes(new Date().getFullYear() -2)
  const isTAlreadyFlied = allowYearsEditing ? false : statusDetails.years_selected?.includes(new Date().getFullYear() -3)
  const isFTAlreadyFlied = allowYearsEditing ? false : statusDetails.years_selected?.includes(new Date().getFullYear() -4)


const prepareParams = () =>{
  let yrs = ""
  if(isFSelected){
    yrs = new Date().getFullYear() -1
  }
  if(isSSelected){
    yrs = yrs + "," + (new Date().getFullYear() - 2)
  }
  if(isTSelected){
    yrs =yrs + "," + (new Date().getFullYear() - 3)
  }
  if(isFTSelected){
    yrs = yrs + ","  + (new Date().getFullYear() - 4)
  }
  const {user_id, tax_file_id} = statusDetails
  const params = {User_id:user_id,Tax_File_Id:tax_file_id,Years_Selected:yrs}
  return params
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
          value="PLEASE SELECT WHICH YEARS YOU WOULD LIKE TO FILE FOR"
        />
        <DocCard
          title={new Date().getFullYear() - 1}
          isFiled = {isFAlreadyFlied}
          isSelected={isFSelected}
          onSelected={() => {
            setIsFSelected(!isFSelected);
          }}
        />
        <DocCard
          title={new Date().getFullYear() - 2}
          isFiled = {isSAlreadyFlied}
          isSelected={isSSelected}
          onSelected={() => {
            setIsSSelected(!isSSelected);
          }}
        />
       
         <DocCard
          title={new Date().getFullYear() - 3}
          isFiled = {isTAlreadyFlied}
          isSelected={isTSelected}
          onSelected={() => {
            setIsTSelected(!isTSelected);
          }}
        />
        <DocCard
          title={new Date().getFullYear() - 4}
          isFiled = {isFTAlreadyFlied}
          isSelected={isFTSelected}
          onSelected={() => {
            setIsFTSelected(!isFTSelected);
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
              if (isFSelected || isSSelected || isTSelected || isFTSelected) {
                setIsLoading(true)
              const params = prepareParams()
                onlineSaveSelectedYears(params, (res)=>{
                  setIsLoading(false)
                  if(res?.status == 1){
                    pageParams?.onDataFormUpdates(statusDetails)
                    navigation.goBack()
                  }else{
                    Alert.alert("Sukhtax", "Something went wrong!")
                  }
                })
              }
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

export default OnlineSelectYearV3;
