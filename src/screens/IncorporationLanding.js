import React, {useEffect, useState} from 'react';
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
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {incorpGetIncorpType, incorpRegisterCorp} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const IncorporationLanding = props => {
  const [incorpTypes, setIncorpTypes] = useState()
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCorp, setSelectedCorp] = useState();

  useEffect(() => {
    setIsLoading(true)
    incorpGetIncorpType({}, (typeRes) =>{
      if(typeRes?.status == 1){
        const incoprs = typeRes?.data
        setIncorpTypes(incoprs)
        setIsLoading(false)
      }
    })
  }, [])

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%',flex:1}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="REGISTER A CORPORATION" marginTop={100} />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WHICH TYPE OF CORPORATION WOULD YOU LIKE TO REGISTER?"
        />
        {incorpTypes &&
          incorpTypes.map((item, index) => {
            return (
              <DocCard
                key = {item.incorporation_type}
                item={item}
                selectedCorp = {selectedCorp}
                onSelected={() => {
                  global.selectedCorp = item
                  setSelectedCorp(item);
                }}
              />
            );
          })}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}>
          <SKButton
            fontSize={16}
            marginTop={30}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'NEXT'}
            onPress={() => {
              if(selectedCorp?.incorporation_type_id == 3){
                setIsLoading(true)
                const {user_id} = global.incStatusData
                const params = {User_id:user_id, Incorporation_Type_Id:selectedCorp?.incorporation_type_id,Incorporation_Category_Id:0}
                incorpRegisterCorp(params, (regisRes) =>{
                  setIsLoading(false)
                  if(regisRes?.status == 1){
                    global.incStatusData = {...global.incStatusData,...regisRes?.data[0]}
                    navigation.navigate('UploadCorp');
                  }else{
                    Alert.alert('SukhTax', regisRes?.message)
                  }
                })
              }else{
                navigation.navigate('NumberNameCorp',{...selectedCorp});
              }
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text
            style={{
              width: '60%',
              textAlign: 'center',
              color: Colors.BLACK,
              fontSize: 12,
              fontFamily: CustomFonts.OpenSansRegular,
            }}>
            DON'T WORRY! ALL OUR FEES ALREADY INCLUDE GOVT. CHARGES
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item, selectedCorp} = props;
  const {fee,incorporation_type} = item
  const isSelected = selectedCorp?.incorporation_type_id == item.incorporation_type_id
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'column',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingVertical: 14,
        alignItems: 'center',
        width: '100%',
        borderRadius: 6,
        borderWidth:1,
        borderColor: Colors.CLR_E77C7E,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {incorporation_type.toUpperCase()}
      </Text>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          marginTop: 3,
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {`TOTAL COST: $${fee}`}
      </Text>
    </TouchableOpacity>
  );
};

export default IncorporationLanding;
