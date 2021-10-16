import React, {useState, useEffect} from 'react';
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
import {incorpGetIncorporatorList} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import {useIsFocused} from '@react-navigation/native';

const IncorporatorsList = props => {
  const [incorporators, setIncorporators] = useState()
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused){
      setIsLoading(true)
      setTimeout(() => {
        const {incorporation_id, user_id} = global.incStatusData
        const params = {User_id:user_id,Incorporation_Id:incorporation_id}
        incorpGetIncorporatorList(params, (incoproratorsRes) =>{
          if(incoproratorsRes?.status == 1){
            setIncorporators(incoproratorsRes?.data)
          }
          setTimeout(() => {
            setIsLoading(false)
          }, 200);
        })
      }, 500);

    }
  }, [isFocused]);


  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="INCOPORATORS" marginTop={100} />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="LET'S ADD THE
          INCORPORATORS' DETAILS"
        />
        <TouchableOpacity 
        style={{width: '100%', flexDirection: 'row'}}
        onPress = {() =>{
          navigation.navigate('IncorpDetails');
        }}
        >
        <Image
          resizeMode="contain"
          style={{width: 30, height: 30, alignSelf: 'center'}}
          source={CustomFonts.add_filled_circle}
        />
          <Text
            style={{
              color: Colors.APP_RED_SUBHEADING_COLOR,
              fontFamily: CustomFonts.OpenSansSemiBold,
              fontSize: 20,
              marginLeft: 23,
              fontWeight: '700',
            }}>
            ADD INCORPORATOR
          </Text>
        </TouchableOpacity>
        {incorporators &&
          incorporators.map((item, index) => {
            return (
              <DocCard
                key = {item.Column1}
                item={item}
                onSelected={() => {
                  navigation.navigate('IncorpDetails',{...item});
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
            disable = {!incorporators || incorporators?.length < 1}
            fontSize={16}
            marginTop={30}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'NEXT'}
            onPress={() => {
              navigation.navigate('AboutCorp');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item, isSelected} = props;
  const {incorporator_name} = item
  if (!incorporator_name) return null
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        marginTop: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        borderRadius: 6,
        paddingRight:20
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Icon name={'square-edit-outline'} size={27} color={Colors.APP_BLUE_HEADING_COLOR} />
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 20,
          fontFamily: CustomFonts.OpenSansRegular,
          fontWeight: '700',
          marginLeft: 23,
        }}>
        {incorporator_name?.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default IncorporatorsList;
