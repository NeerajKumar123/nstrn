import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DashCard from '../components/DashCard';
import RoyaltyDashCard from '../components/RoyaltyDashCard';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import {loadIntialData} from '../helpers/BaseUtility';
const {width} = Dimensions.get('window');
import {useIsFocused} from '@react-navigation/native';
import {
  getServicePriceList,
  getUserProfileDetails,
  getInvalidSIN,
} from '../apihelper/Api';
import messaging from '@react-native-firebase/messaging';
import BottomTab from '../components/BottomTab';

const Dashboard = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [taxFilingFee, setTaxFilingFee] = useState(49.99);
  const [userFullName, setUserFullName] = useState('');
  const [refCode, setRefCode] = useState();
  const [lastChangedDate, setLastChangedDate] = useState();
  const [lastChangedModule, setLastChangedModule] = useState();
  const [lastChangedStatus, setLastChangedStatus] = useState();

  const [statusOnline, setStatusOnline] = useState();
  const [statusIncorp, setStatusIncorp] = useState();
  const [statusReqTaxDocs, setStatusReqTaxDocs] = useState();
  const [statusCRA, setStatusCRA] = useState();

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      const user = global.userInfo;
      const fName = user?.firstname ?? '';
      const lName = user?.lastname ?? '';
      setUserFullName(fName + ' ' + lName);
      setTimeout(() => {
        loadIntialData(res => {
          setStatusOnline(
            global.onlineStatusData?.tax_file_status_name ?? undefined,
          );
          setStatusIncorp(
            global.incStatusData?.incorporation_status_name ?? undefined,
          );
          setStatusReqTaxDocs(
            global.taxDocsStatusData?.tax_docs_status_name ?? undefined,
          );
          setStatusCRA(
            global.craLattersData?.cra_letters_status_name ?? undefined,
          );
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        });
      }, 500);

      const {user_id = 0} = global?.userInfo ? global?.userInfo : {};
      if (user_id) {
        getUserProfileDetails({user_id: user_id}, userDetailsRes => {
          if (userDetailsRes.status === 1) {
            const user = userDetailsRes?.data?.[0];
            const fName = user?.firstname ?? '';
            const lName = user?.lastname ?? '';
            setUserFullName(fName + ' ' + lName);
            setRefCode(user?.referral_code);
            setLastChangedDate(user?.change_date ?? undefined);
            setLastChangedModule(user?.Module_changed ?? undefined);
            setLastChangedStatus(user?.change_name ?? undefined);
          }
        });
      }
    }
  }, [isFocused]);

  useEffect(() => {
    getServicePriceList(priceListRes => {
      console.log('priceListRes', priceListRes);
      if (priceListRes?.status === 1) {
        let onlineTaxFees = priceListRes?.data?.filter(
          fee => fee.services_fee_id === 1,
        );
        const feeObj = onlineTaxFees[0];
        setTaxFilingFee(feeObj?.service_fee);
      }
    });
  }, []);

  useEffect(() => {
    getInvalidSIN(invalidSinRes => {
      if (invalidSinRes?.status === 1) {
        let invalidSinList = invalidSinRes?.data;
        global.invalidSinList = invalidSinList;
      }
    });
  }, []);

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
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this is new page of dashboard
  const navigateToScreen = item => {
    switch (item.id) {
      case 1:
        navigation.navigate('Home');
        break;
      case 2:
        let {book_an_appointment_link} = global.incStatusData;
        if (!book_an_appointment_link) {
          book_an_appointment_link = global.statusData;
        }
        if (book_an_appointment_link) {
          navigation.navigate('SKWebPage', {pageUrl: book_an_appointment_link});
        } else {
          Alert.alert('SukhTax', 'Something went wrong.');
        }
        break;
      case 3:
        onlineMoveToPage();
        break;
      case 4:
        incorpMoveToPage();
        break;
      case 5:
        reqMoveToPage();
        break;
      case 6:
        craMoveToPage();
        break;
      case 7:
        if (refCode?.length > 0 && false) {
          navigation.navigate('RoyaltyWallat');
        } else {
          navigation.navigate('RoyaltyInstruction');
        }
        break;
      default:
        break;
    }
  };
  const onlineMoveToPage = () => {
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
      Online_Button_Enabled,
    } = global?.onlineStatusData ?? {};

    if (Online_Button_Enabled == 0) {
      navigation.navigate('OnlineTaxFilingStatus');
    } else {
      if (authorization_document_uploaded) {
        navigation.navigate('AnyThingElse');
      } else if (document_uploaded) {
        navigation.navigate('AuthorizerList');
      } else if (my_year_info_filled) {
        navigation.navigate('OnlineDocuments');
      } else if (spouse_info_filled) {
        navigation.navigate('DependentsList');
      } else if (dependent_info_filled) {
        navigation.navigate('MyTaxYear', {pageIndex: 0});
      } else if (banking_family_info_filled) {
        const yrwiseRecords = global?.onlineStatusData?.Year_Wise_Records;
        let firstYearData = yrwiseRecords?.[0] || {};
        let isMarried = false;
        let isDepSel = false;
        if (
          firstYearData?.marital_status_id == 2 ||
          firstYearData?.marital_status_id == 3
        ) {
          isMarried = true;
        }
        if (firstYearData?.dependents) {
          isDepSel = true;
        }
        if (isMarried) {
          navigation.navigate('Spouse');
        } else if (isDepSel) {
          navigation.navigate('DependentsList');
        } else {
          navigation.navigate('MyTaxYear', {pageIndex: 0});
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
      incorporation_status_id,
    } = global?.incStatusData;
    if (incorporation_status_id == 1) {
      if (hst_registration || authorization_document_uploaded) {
        navigation.navigate('HSTRegistration');
      } else if (identification_document_uploaded) {
        navigation.navigate('IncorporatorsList');
      } else {
        navigation.navigate('IncorporationLanding');
      }
    } else if (incorporation_status_id == 3 || incorporation_status_id == 2) {
      navigation.navigate('IncorpApplyStatus');
    } else {
      navigation.navigate('IncorporationLanding');
    }
  };
  const reqMoveToPage = props => {
    const {tax_docs_status_id = 1} = global?.taxDocsStatusData;
    if (tax_docs_status_id == 2 || tax_docs_status_id == 3) {
      // inprogrees
      navigation.navigate('RequestApplyStatus');
    } else {
      navigation.navigate('RequestLanding');
    }
  };

  const craMoveToPage = props => {
    navigation.navigate('CRALanding');
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        width: width,
        height: '100%',
      }}>
      {isLoading && <SKLoader />}
      <View style={{width: '100%', padding: 16}}>
        <ProfileHeader
          username={userFullName}
          lastChangedDate={lastChangedDate}
          lastChangedModule={lastChangedModule}
          lastChangedStatus={lastChangedStatus}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}>
        <DashCard
          title={'HOME'}
          desc={`STATUS\nPROFILE\nMY DOCUMENTS`}
          marginTop={10}
          onClick={() => {
            navigateToScreen({id: 1});
          }}
        />
        <RoyaltyDashCard
          title={'SUKH TAX LOYALTY PROGRAM'}
          desc={
            refCode?.length
              ? 'Check your wallet balance'
              : `ENROL TODAY! GET PAID INSTANTLY`
          }
          marginTop={10}
          onClick={() => {
            navigateToScreen({id: 7});
          }}
        />
        <DashCard
          title={'BOOK AN APPOINTMENT'}
          desc={`APPOINTMENTS\nBOOKINGS`}
          marginTop={16}
          onClick={() => {
            navigateToScreen({id: 2});
          }}
        />
        <DashCard
          title={'ONLINE TAX RETURN'}
          desc={`STARTING FROM\n$${taxFilingFee}`}
          status={statusOnline}
          marginTop={10}
          onClick={() => {
            navigateToScreen({id: 3});
          }}
        />
        <DashCard
          title={'INCORPORATION'}
          desc={`OPEN A\nCORPORATION`}
          status={statusIncorp}
          marginTop={16}
          onClick={() => {
            navigateToScreen({id: 4});
          }}
        />
        <DashCard
          title={'REQUEST TAX DOCS'}
          desc={`NOA, T1, GENERAL,\netc.`}
          status={statusReqTaxDocs}
          marginTop={16}
          onClick={() => {
            navigateToScreen({id: 5});
          }}
        />
        <DashCard
          title={'CRA LETTERS'}
          desc={`CORRESPONDENCE`}
          status={statusCRA}
          marginTop={16}
          onClick={() => {
            navigateToScreen({id: 6});
          }}
        />
      </ScrollView>
      <BottomTab
        selectedIndex={1}
        onTabSelected={index => {
          if (index == 2) {
            navigation.navigate('AllDocuments');
          } else if (index == 3) {
            navigation.navigate('Messages');
          } else if (index == 4) {
            navigation.navigate('Profile');
          }
        }}
      />
    </View>
  );
};

export default Dashboard;

const ProfileHeader = props => {
  const {
    username = 'User',
    lastChangedModule,
    lastChangedDate,
    lastChangedStatus,
  } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        elevation: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 3, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: Colors.APP_BLUE_HEADING_COLOR,
        borderRadius: 8,
        padding: 16,
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <View style={{flexDirection: 'column', flex: 1.4}}>
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 23,
            fontWeight: '400',
          }}>
          Welcome,
        </Text>
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 23,
            fontWeight: '700',
          }}>
          {username}
        </Text>
      </View>
      <View
        style={{
          marginLeft: 5,
          flexDirection: 'column',
          flex: 0.8,
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 18,
            textAlign: 'right',
            fontWeight: '400',
          }}>
          {lastChangedDate}
        </Text>
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 13,
            fontWeight: '400',
            textAlign: 'right',
            marginTop: 10,
          }}>
          {lastChangedModule}
        </Text>
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 13,
            fontWeight: '400',
            textAlign: 'right',
          }}>
          {lastChangedStatus}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
