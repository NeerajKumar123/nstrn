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
const RequestLanding = props => {
  const [docsTypes, setDocsTypes] = useState([{name:'d1'},{name:'d2'},{name:'d3'},{name:'d4'}])
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState();

  // useEffect(() => {
  //   setIsLoading(true)
  //   incorpGetIncorpType({}, (typeRes) =>{
  //     if(typeRes?.status == 1){
  //       const incoprs = typeRes?.data
  //       setIncorpTypes(incoprs)
  //       setSelectedCorp(incoprs[2])
  //       setIsLoading(false)
  //     }
  //   })
  // }, [])

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1,
        paddingBottom:20
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        showsVerticalScrollIndicator = {false}
        contentContainerStyle={{
          paddingHorizontal: 20,          
        }}>
        <Heading value="TAX DOCUMENTS" marginTop={60} />
        <Heading
          fontSize={16}
          marginTop={0}
          marginBottom={0}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="NEED A TAX DOCUMENT"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={0}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE CAN SURELY HELP YOU. PLEASE SELECT WHAT YOU NEED
          FROM BELOW:"
        />
        {docsTypes &&
          docsTypes.map((item, index) => {
            return (
              <DocCard
                key = {item.name}
                item={item}
                onSelected={(selectedValue) => {
                  const newValue = {
                    ...selectedValue,
                    isSelected: !selectedValue.isSelected,
                  };
                  const index = docsTypes.findIndex(x => x.name === item.name);
                  const old = [...docsTypes];
                  if (index != -1) {
                    old[index] = newValue;
                  }
                  setDocsTypes([...old]);
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
              let sels = []
              docsTypes.map(item => {
                if (item.isSelected) {
                  sels.push(item)
                }
              });
              console.log('sels',sels)
              global.selectedDocsTypes = sels
              setTimeout(() => {
                console.log('global.selectedDocsTypes',global.selectedDocsTypes)
                navigation.navigate('RequestYears',{pageIndex:0});
              }, 200);

              // if(selectedCorp?.incorporation_type_id == 3){
              //   setIsLoading(true)
              //   const {user_id} = global.incStatusData
              //   const params = {User_id:user_id, Incorporation_Type_Id:selectedCorp?.incorporation_type_id,Incorporation_Category_Id:0}
              //   incorpRegisterCorp(params, (regisRes) =>{
              //     setIsLoading(false)
              //     if(regisRes?.status == 1){
              //       global.incStatusData = {...global.incStatusData,...regisRes?.data[0]}
              //       navigation.navigate('UploadCorp');
              //     }else{
              //       Alert.alert('SukhTax', regisRes?.message)
              //     }
              //   })
              // }else{
              //   navigation.navigate('NumberNameCorp',{...selectedCorp});
              // }
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
            DONT WORRY! ALL OUR FEES ALREADY INCLUDE GOVT. CHARGES
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item,onSelected} = props;
  const {name,isSelected} = item
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
        borderColor:Colors.CLR_E77C7E,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      onPress={() => {
        onSelected(item)
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {name.toUpperCase()}
      </Text>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          marginTop: 3,
          color: Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {`TOTAL COST: $99.99`}
      </Text>
    </TouchableOpacity>
  );
};

export default RequestLanding;
