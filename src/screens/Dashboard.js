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
import {loadIntialData} from '../helpers/BaseUtility'
import * as SKTStorage from '../helpers/SKTStorage';

import * as CustomFonts from '../constants/FontsDefs';
import {useIsFocused} from '@react-navigation/native';
import {
  getServicePriceList,
  getUserProfileDetails,
  getInvalidSIN
} from '../apihelper/Api';
import messaging from '@react-native-firebase/messaging';

const data = [
  {
    id: 1,
    name: 'HOME',
    desc: 'STATUS PROFILE MY DOCUMENTS',
    image: CustomFonts.home,
    colors: [Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR],
  },
  {
    id: 2,
    name: 'BOOK AN',
    desc: 'APPOINTMENT',
    image: CustomFonts.visit_us,
    colors: [Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR],
  },
  {
    id: 3,
    name: 'ONLINE TAX RETURN',
    desc: 'STARTING FROM $44.99',
    image: CustomFonts.online,
    colors: [Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR],
  },
  {
    id: 4,
    name: 'INCORPORATION',
    desc: 'OPEN A CORPORATION',
    image: CustomFonts.incorporation,
    colors: [Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR],
  },
  {
    id: 5,
    name: 'REQUEST TAX DOCS',
    desc: 'NOA, T1,GENERAL, etc.',
    image: CustomFonts.request,
    colors: [Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR],
  },
  {
    id: 6,
    name: 'CRA LETTERS',
    desc: 'CORRESPONDENCE',
    image: CustomFonts.cra_latters,
    colors: [Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR],
  },
];

const Dashboard = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [taxFilingFee, setTaxFilingFee] = useState(44.99);
  const [userFullName, setUserFullName] = useState('')
  // const book_an_appointment_link = global.userInfo

  useEffect(() => {
    if(isFocused){
      setIsLoading(true);
      const user = global.userInfo
      const fName = user?.firstname ?? ''
      const lName = user?.lastname ?? ''
      setUserFullName(fName + ' ' + lName )
      setTimeout(() => {
        loadIntialData((res)=>{
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        })
      }, 500);
      
      const {user_id = 0} = global?.userInfo ? global?.userInfo : {}
      if (user_id) {
        getUserProfileDetails({user_id:user_id},(userDetailsRes)=>{
          console.log('userDetailsRes===>',userDetailsRes)
          if (userDetailsRes.status == 1) {
            const user = userDetailsRes?.data?.[0]
            const fName = user?.firstname ?? ''
            const lName = user?.lastname ?? ''
            setUserFullName(fName + ' ' + lName )
          }
        })
      }
    }
  }, [isFocused])

  

  useEffect(() => {
    getServicePriceList((priceListRes) =>{
      if(priceListRes?.status == 1){
        let onlineTaxFees = priceListRes?.data?.filter(fee => fee.services_fee_id == 1);
        const feeObj = onlineTaxFees[0]
        setTaxFilingFee(feeObj?.service_fee)
      }
    })
  }, [])

  useEffect(() => {
    getInvalidSIN((invalidSinRes) =>{
      if(invalidSinRes?.status == 1){
        let invalidSinList = invalidSinRes?.data
        global.invalidSinList = invalidSinList
      }
    })
  }, [])

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);

// this is new page of dashboard 
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
          craMoveToPage()
        break;        
      default:
        break;
    }
  };
  const onlineMoveToPage = props => {
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
      Online_Button_Enabled
    } = global?.onlineStatusData ?? {};

    if (Online_Button_Enabled == 0) {
      navigation.navigate('OnlineTaxFilingStatus')
    }else{
      if (authorization_document_uploaded) {
        navigation.navigate('AnyThingElse');
      } else if (document_uploaded) {
        navigation.navigate('AuthorizerList');
      } else if (my_year_info_filled) {
        navigation.navigate('OnlineDocuments');
      } else if (spouse_info_filled) {
        navigation.navigate('DependentsList');
      } else if (dependent_info_filled) {
        navigation.navigate('MyTaxYear',{pageIndex:0}); 
      } else if (banking_family_info_filled) {
        const yrwiseRecords = global?.onlineStatusData?.Year_Wise_Records
        let firstYearData = yrwiseRecords?.[0] || {}
        let isMarried = false
        let isDepSel = false
        if (firstYearData?.marital_status_id == 2 || firstYearData?.marital_status_id == 3) {
          isMarried = true
        }
        if (firstYearData?.dependents) {
          isDepSel = true
        }
        if (isMarried) {
          navigation.navigate('Spouse');
        }else if (isDepSel){
          navigation.navigate('DependentsList');
        }else{
          navigation.navigate('MyTaxYear',{pageIndex:0});
        }
      } else if (about_info_filled) {
        navigation.navigate('BankingAndMore');
      } else if (identification_document_uploaded) {
        navigation.navigate('BasicInfo');
      } else if (years_selected) {
        navigation.navigate('Identification');
      } else {
        navigation.navigate('OnlineReturnLanding');
      }
    }    
  };

  // This is neeraj33...
  const incorpMoveToPage = props => {
    const {
      hst_registration, // HST
      identification_document_uploaded, // incprtr
      authorization_document_uploaded, // HST
      incorporation_status_id
    } = global?.incStatusData;
    if(incorporation_status_id ==1){
      if (hst_registration || authorization_document_uploaded) {
        navigation.navigate('HSTRegistration');
      } else if (identification_document_uploaded) {
        navigation.navigate('IncorporatorsList');
      } else {
        navigation.navigate('IncorporationLanding');
      }
    }else if(incorporation_status_id == 3 || incorporation_status_id == 2){
      navigation.navigate('IncorpApplyStatus');
    }else {
      navigation.navigate('IncorporationLanding');
    }
  };
  const reqMoveToPage = props => {
    const {tax_docs_status_id = 1} = global?.taxDocsStatusData
    if (tax_docs_status_id == 2 || tax_docs_status_id == 3) { // inprogrees 
      navigation.navigate('RequestApplyStatus');
    }else{
      navigation.navigate('RequestLanding');
    }
  };

  const craMoveToPage = props => {
    navigation.navigate('CRALanding');
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
        {`Welcome ${userFullName}`}
      </Text>
      {data && (
        <FlatList
          contentContainerStyle={{
            backgroundColor: Colors.WHITE,
            marginTop: 10,
            marginBottom: 100,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 50
          }}
          showsVerticalScrollIndicator = {false}
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
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          backgroundColor:Colors.WHITE,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            const options = [
              {
                text: 'Cancel',
                onPress: () => {
                }
              },
              {
                text: 'Yes,Logout',
                onPress: () => {
                  DeviceEventEmitter.emit('user_loggedin', false);
                }
              }
            ]
            Alert.alert('SukhTax','Are you sure you want to logout?',options)
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
