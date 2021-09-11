import React,{useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Alert
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {incorpSaveHSTRegistration} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HSTRegistration = props => {
  const navigation = useNavigation();

  const data = [{name: 'YES (FREE OF CHARGE)', id:1}, {name: 'NO', id:0}];
  const [selectedOption, setSelectedOption] = useState({name: 'YES (FREE OF CHARGE)', id:1})
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
        <Heading value="HST REGISTRATION" marginTop={122} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WOULD YOU LIKE US TO
          REGISTER YOUR CORPORATION
          AS AN HST REGISTRANT?"
        />
        {data &&
          data.map((item, index) => {
            return (
              <DocCard
                key = {item.name}
                item={item}
                isSelected = {selectedOption?.id == item.id}
                onSelected={() => {
                  setSelectedOption(item)
                }}
              />
            );
          })}
        <SKButton
          disable = {!selectedOption}
          marginTop={30}
          fontSize={16}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'NEXT'}
          onPress={() => {
            const {incorporation_id, user_id} = global.incStatusData
            const params = {User_id:user_id,Incorporation_Id:incorporation_id,HST_Registration:selectedOption?.id}
            incorpSaveHSTRegistration(params, (hstRes) =>{
              if(hstRes?.status == 1){
                navigation.navigate('IncorpPaymentDetails');
              }else{
                const msg = hstRes?.message ?? 'Something went wront, Please try again later.'
                Alert.alert('SukhTax',msg)
              }
            })
          }}
        />
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item,isSelected} = props;
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
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default HSTRegistration;
