import React, {useEffect, useState} from 'react';
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
import {useIsFocused} from '@react-navigation/native';
import {
  getActiveFileStatusOnLogin,
  getServicePriceList,
  incorpGetIncorpStatus,
  taxDocsGetTaxDocsStatus
} from '../apihelper/Api';

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
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [taxFilingFee, setTaxFilingFee] = useState(44.99);
  const userFullName = global.userInfo
    ? `${global.userInfo.firstname} ${global.userInfo.lastname}`
    : '';

  useEffect(() => {
    if(isFocused){
      setIsLoading(true);
      setTimeout(() => {
        const {user_id} = global.userInfo
        const params = {User_Id:user_id}
        getActiveFileStatusOnLogin(params, (fileStatusRes) =>{
          const statusData = fileStatusRes?.data && fileStatusRes?.data.length > 0 ? fileStatusRes?.data[0] : undefined
          global.onlineStatusData = statusData ? statusData : {}
          incorpGetIncorpStatus(params,(incStatusRes) =>{
            if(incStatusRes?.status == 1){
              setIsLoading(false)
              const incStatusData = incStatusRes?.data && incStatusRes?.data.length > 0 ? incStatusRes?.data[0] : undefined
              global.incStatusData = incStatusData ? {...incStatusData,...global.userInfo} : {...global.onlineStatusData,...global.userInfo}
              taxDocsGetTaxDocsStatus(params,(taxDocsRes) =>{
                const taxDocsResData = taxDocsRes?.data && taxDocsRes?.data.length > 0 ? taxDocsRes?.data[0] : undefined
                global.taxDocsStatusData = taxDocsResData ? {...taxDocsResData,...global.userInfo} : {...global.taxDocsResData,...global.userInfo}
              })
            }
          })  
        })
      }, 500);
    }
  }, [isFocused])

  useEffect(() => {
    setIsLoading(true);
      // setTimeout(() => {
      //   const {user_id} = global.userInfo
      //   const params = {User_Id:user_id}
      //   getActiveFileStatusOnLogin(params, (fileStatusRes) =>{
      //     const statusData = fileStatusRes?.data && fileStatusRes?.data.length > 0 ? fileStatusRes?.data[0] : undefined
      //     global.onlineStatusData = statusData ? statusData : {}
      //     incorpGetIncorpStatus(params,(incStatusRes) =>{
      //       if(incStatusRes?.status == 1){
      //         setIsLoading(false)
      //         const incStatusData = incStatusRes?.data && incStatusRes?.data.length > 0 ? incStatusRes?.data[0] : undefined
      //         global.incStatusData = incStatusData ? {...incStatusData,...global.userInfo} : {...global.onlineStatusData,...global.userInfo}
      //         taxDocsGetTaxDocsStatus(params,(taxDocsRes) =>{
      //           const taxDocsResData = taxDocsRes?.data && taxDocsRes?.data.length > 0 ? taxDocsRes?.data[0] : undefined
      //           global.taxDocsStatusData = taxDocsResData ? {...taxDocsResData,...global.userInfo} : {...global.taxDocsResData,...global.userInfo}
      //         })
      //       }
      //     })  
      //   })
      // }, 500);
    getServicePriceList((priceListRes) =>{
      if(priceListRes?.status == 1){
        let onlineTaxFees = priceListRes?.data?.filter(fee => fee.services_fee_id == 1);
        const feeObj = onlineTaxFees[0]
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
          let {book_an_appointment_link}  = global.incStatusData
          if(!book_an_appointment_link){
            book_an_appointment_link  = global.statusData
          }
          if(book_an_appointment_link){
            navigation.navigate('SKWebPage',{pageUrl:book_an_appointment_link})
          }else{
            Alert.alert('SukhTax','Something went wrong.')
          }
          break;
      case 3:
        onlineMoveToPage()
        break;
      case 4:
        incorpMoveToPage()
        break;
        case 5:
          reqMoveToPage()
          break;
        case 6:
        navigation.navigate('CRALanding');
        break;        
      default:
        break;
    }
  };
  const onlineMoveToPage = props => {
    navigation.navigate('OnlineReturnLanding');
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
      authorization_document_uploaded = 1,
    } = global?.onlineStatusData;

    if (authorization_document_uploaded) {
      navigation.navigate('AnyThingElse');
    } else if (document_uploaded) {
      navigation.navigate('AuthorizerList');
    } else if (my_year_info_filled) {
      navigation.navigate('OnlineDocuments');
    } else if (spouse_info_filled) {
      navigation.navigate('Dependents');
    } else if (dependent_info_filled) {
      navigation.navigate('MyTaxYear');
    } else if (banking_family_info_filled) {
      navigation.navigate('MyTaxYear');
    } else if (about_info_filled) {
      navigation.navigate('BankingAndMore');
    } else if (identification_document_uploaded) {
      navigation.navigate('BasicInfo');
    } else if (years_selected) {
      navigation.navigate('Identification');
    } else {
      navigation.navigate('OnlineReturnLanding');
    }
  };
  const incorpMoveToPage = props => {
    navigation.navigate('IncorporationLanding');
    return
    const {
      hst_registration, // HST
      identification_document_uploaded, // incprtr
      authorization_document_uploaded, // HST
      incorporation_status_id
    } = global?.incStatusData;
    if(incorporation_status_id ==1 ){
      if (hst_registration || authorization_document_uploaded) {
        navigation.navigate('HSTRegistration');
      } else if (identification_document_uploaded) {
        navigation.navigate('IncorporatorsList');
      } else {
        navigation.navigate('IncorporationLanding');
      }
    }else if(incorporation_status_id == 2){
      navigation.navigate('IncorpInProcessScreen');
    }else if(incorporation_status_id == 3){
      navigation.navigate('IncorpApplyStatus');
    }else {
      navigation.navigate('IncorporationLanding');
    }
  };
  const reqMoveToPage = props => {
    navigation.navigate('RequestLanding');
    
  };

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      {isLoading && <SKLoader />}
      <DashHeader
        onRightClicked={() => {
          navigation.navigate('Profile');
        }}
      />
      <Text
        style={{
          fontWeight: '700',
          fontSize: 20,
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontFamily: CustomFonts.OpenSansRegular,
        }}>
        {`Welcome, ${userFullName}`}
      </Text>
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
              fee={taxFilingFee}
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
