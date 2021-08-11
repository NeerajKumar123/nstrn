import React,{useState, useEffect} from 'react';
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
import SKLoader from '../components/SKLoader';
import SKButton from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {incorpGetIncorporatorList} from '../apihelper/Api';
const IncorpFinalStep = props => {
  const navigation = useNavigation();

  const [incorporators, setIncorporators] = useState()
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    const {incorporation_id, user_id} = global.statusData
      // const params = {User_id:user_id,Incorporation_Id:incorporation_id}
      const params = {User_id:user_id,Incorporation_Id:30}
    incorpGetIncorporatorList(params, (incoproratorsRes) =>{
      setIsLoading(false)
      if(incoproratorsRes?.status == 1){
        setIncorporators(incoproratorsRes?.data)
      }
    })
  }, []);

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
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="FINAL STEP" marginTop={122} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="AUTHORIZATION"
        />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE NEED YOUR
          AUTHORIZATION TO COMPLETE
          THE INCORPORATION PROCESS"
        />
        {incorporators &&
          incorporators.map((item, index) => {
            return (
              <DocCard
                item={item}
                onSelected={() => {
                  console.log('data', item);
                  navigation.navigate('SignaturePage', {authIndex: 1});
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
            navigation.navigate('HSTRegistration');
          }}
        />
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item, isSelected} = props;
  const {Column1} = item
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
        props.onSelected && props.onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.WHITE,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {Column1}
      </Text>
      <Icon
        style={{position: 'absolute', right: 20}}
        name="check-circle"
        size={23}
        color={Colors.WHITE}
      />
    </TouchableOpacity>
  );
};

export default IncorpFinalStep;
