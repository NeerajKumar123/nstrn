import React,{useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  DeviceEventEmitter,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DashCard from '../components/DashCard';
import SKLoader from '../components/SKLoader';
import {DashHeader} from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {getActiveFileStatusOnLogin,getServicePriceList} from '../apihelper/Api';

const data = [
  {
    id: 1,
    name: 'HOME',
    desc: 'STATUS PROFILE MY DOCUMENTS',
    image: CustomFonts.home,
    colors: [Colors.CLR_7F7F9F, Colors.CLR_E77C7E],
  },
  {
    id: 2,
    name: 'VISIT US',
    desc: 'BOOK AN APPOINTMENT',
    image: CustomFonts.visit_us,
    colors: [Colors.CLR_7F7F9F, Colors.CLR_E77C7E],
  },
  {
    id: 3,
    name: 'ONLINE TAX RETURN',
    desc: 'STARTING FROM $44.99',
    image: CustomFonts.online,
    colors: [Colors.CLR_E77C7E, Colors.CLR_E77C7E],
  },
  {
    id: 4,
    name: 'INCORPORATION',
    desc: 'OPEN A CORPORATION',
    image: CustomFonts.incorporation,
    colors: [Colors.CLR_E77C7E, Colors.CLR_E77C7E],
  },
  {
    id: 5,
    name: 'REQUEST TAX DOCS',
    desc: 'NOA, T1,GENERAL, etc.',
    image: CustomFonts.request,
    colors: [Colors.CLR_E77C7E, Colors.CLR_7F7F9F],
  },
  {
    id: 6,
    name: 'CRA LATTERS',
    desc: 'CORRESPONDENCE',
    image: CustomFonts.cra_latters,
    colors: [Colors.CLR_E77C7E, Colors.CLR_7F7F9F],
  },
];

const Dashboard = props => {
   
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [taxFilingFee, setTaxFilingFee] = useState(44.99)

  useEffect(() => {
    setIsLoading(true)
    const userid = global.userInfo?.user_id;
    const params = {User_Id:userid}
    getActiveFileStatusOnLogin(params, (fileStatusRes) =>{
      const statusData = fileStatusRes?.data && fileStatusRes?.data.length > 0 ? fileStatusRes?.data[0] : undefined
      global.statusData = statusData || {}
      setIsLoading(false)
    })
    getServicePriceList((priceRes) =>{
      if(priceRes?.data){
        const fees = priceRes?.data
        const onlineTaxFeeObjs = fees && fees.filter((x) => x.services_fee_id == 1);
        const feeObj = onlineTaxFeeObjs?.[0]
        setTaxFilingFee(feeObj?.service_fee)
      }
    })
  }, [])

  const navigateToScreen = item => {
    switch (item.id) {
      case 1:
        navigation.navigate('Home');
        break;
        case 2:
          const {book_an_appointment_link}  = global.statusData
          navigation.navigate('SKWebPage',{pageUrl:book_an_appointment_link})
          break;
      case 3:
        const {Online_Button_Enabled} = global.statusData
        if(!Online_Button_Enabled){
          Alert.alert('SukhTax','You have already submitted your details, and your file is currently being processed. Please use the Home screen to edit any details.')
        }else{
          moveToPage()
        }
        break;
      case 4:
        return
        navigation.navigate('IncorportionLandiing');
        break;
      default:
        break;
    }
  };
  const moveToPage = props => {
    navigation.navigate('OnlineReturnLanding')
    return
    const {
      years_selected = 0,
      identification_document_uploaded = 0,
      about_info_filled = 0,
      banking_family_info_filled = 0,
      dependent_info_filled = 0,
      spouse_info_filled = 0,
      my_year_info_filled = 0,
      document_uploaded = 0,
      authorization_document_uploaded = 1
    } = global.statusData;
    // const 
    //   years_selected = 0,
    //   identification_document_uploaded = 0,
    //   about_info_filled = 0,
    //   banking_family_info_filled = 0,
    //   dependent_info_filled = 0,
    //   spouse_info_filled = 0,
    //   my_year_info_filled = 0,
    //   document_uploaded = 0,
    //   authorization_document_uploaded = 0
    

     if(authorization_document_uploaded){
      navigation.navigate('AnyThingElse')
    }else if(document_uploaded){
      navigation.navigate('AuthorizerList')
    }else if(my_year_info_filled){
      navigation.navigate('OnlineDocuments')
    }else if(spouse_info_filled){
      navigation.navigate('Dependents')
    }else if(dependent_info_filled){
      navigation.navigate('MyTaxYear')
    }else if(banking_family_info_filled){
      navigation.navigate('MyTaxYear')
    }else if(about_info_filled){
      navigation.navigate('BankingAndMore')
    }else if(identification_document_uploaded){
      navigation.navigate('BasicInfo')
    }else if(years_selected){
      navigation.navigate('Identification')
    }else{
      navigation.navigate('OnlineReturnLanding')
    }
  };

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      {isLoading && <SKLoader/>}
      <DashHeader
        onRightClicked={() => {
          console.log('onRightClicked');
          navigation.navigate('Profile');
        }}
      />
      {data && (
        <FlatList
          contentContainerStyle={{
            backgroundColor: Colors.WHITE,
            marginTop: 10,
            marginBottom: 100,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 50,
          }}
          alwaysBounceVertical={false}
          keyExtractor={(item, index) => 'key_' + index}
          data={data}
          numColumns={2}
          renderItem={({item}) => (
            <DashCard
              fee = {taxFilingFee}
              item={item}
              onSelected={() => {
                navigateToScreen(item);
              }}
            />
          )}
        />
      )}
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: Platform.OS == 'ios' ? 20 : 0,
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            DeviceEventEmitter.emit('user_loggedin', false);
          }}>
          <Image
            resizeMode="contain"
            style={{width: 20, height: 18, marginRight: 5}}
            source={CustomFonts.logout_icon}
          />
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              fontFamily: CustomFonts.OpenSansRegular,
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
