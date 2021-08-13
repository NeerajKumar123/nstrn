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
import {incorpGetIncorpCategory, incorpRegisterCorp} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
const NumberNameCorp = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [incorpCategories, setIncorpCategories] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    setIsLoading(true)
    incorpGetIncorpCategory({}, (cateRes) =>{
      if(cateRes?.status == 1){
        const incorpCats = cateRes?.data
        setIncorpCategories(incorpCats)
        setSelectedCategory(incorpCats[0])
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
        <Heading value="REGISTER A CORPORATION" marginTop={100} />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="ARE YOU LOOKING TO REGISTER
          AS A NUMBERED OR NAME
          CORPORATION?"
        />
        {incorpCategories &&
          incorpCategories.map((item, index) => {
            return (
              <DocCard
                key = {item.incorporation_category}
                item={item}
                selectedCategory = {selectedCategory}
                onSelected={() => {
                  setSelectedCategory(item);
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
              setIsLoading(true)
                const {user_id} = global.incStatusData
                const params = {User_id:user_id, Incorporation_Type_Id:pageParams?.incorporation_type_id,Incorporation_Category_Id:selectedCategory?.incorporation_category_id}
                incorpRegisterCorp(params, (regisRes) =>{
                  setIsLoading(false)
                  if(regisRes?.status == 1){
                    global.incStatusData = {...global.incStatusData,...regisRes?.data[0]}
                    navigation.navigate('UploadCorp');
                  }else{
                    Alert.alert('SukhTax', regisRes?.message)
                  }
                })
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item, selectedCategory,onSelected} = props;
  const {incorporation_category,fee} = item
  const isSelected = selectedCategory?.incorporation_category_id == item.incorporation_category_id
  const showFee = parseFloat(fee) > 0
  return (
    <TouchableOpacity
      key = {incorporation_category}
      style={{
        flexDirection: 'column',
        justifyContent:'center',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingVertical: 14,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        minHeight:70,
        borderRadius: 6,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.CLR_7F7F9F,
      }}
      onPress={() => {
        onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.WHITE,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {incorporation_category.toUpperCase()}
      </Text>
      {showFee && 
      <Text
      style={{
        width: '100%',
        textAlign: 'left',
        marginTop: 3,
        color: Colors.WHITE,
        fontSize: 17,
        fontWeight: '700',
      }}>
      {`$${fee} EXTRA`}
    </Text>
      }
      
    </TouchableOpacity>
  );
};

export default NumberNameCorp;
