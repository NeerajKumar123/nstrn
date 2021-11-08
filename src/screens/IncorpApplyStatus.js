import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton, {DarkBlueButton} from '../components/SKButton';
import {getIncorporationDocs} from '../apihelper/Api';
import SKLoader from '../components/SKLoader';

const IncorpApplyStatus = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const shouldGoToHome = pageParams?.shouldGoToHome

  IncorpApplyStatus
  const {
    incorporation_status_name = 'File not Submitted',
    status_description = 'Looks like you have to complete your registration and upload document still!',
    new_message_count = 0,
    incorporation_status_id = 1,
  } = global.incStatusData;

  console.log('status_description',status_description)

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1,
      }}>
      <AppHeader 
      navigation={navigation}
      onLeftClicked = {()=>{
        if (shouldGoToHome) {
          navigation.popToTop()
        }else{
          navigation.goBack()
        }
      }}
       />
      <ScrollView
        style={{width: '100%', flex:1}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Platform.OS == 'ios' ? 0 : 0,
        }}>
        {incorporation_status_id == 1 && (
          <NotSubmitted
            incorporation_status_name={incorporation_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
            marginTop={25}
          />
        )}
        {incorporation_status_id == 2 && (
          <InProcess
            incorporation_status_name={incorporation_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
          />
        )}
        {incorporation_status_id == 3 && (
          <AllSet
            incorporation_status_name={incorporation_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
          />
        )}
      </ScrollView>
    </View>
  );
};

const NotSubmitted = props => {
  const {
    navigation,
    incorporation_status_name,
    status_description,
    new_message_count,
  } = props;

  const incorpMoveToPage = props => {
    console.log('IncorporationLanding',incorporation_status_id)
    const {
      hst_registration, // HST
      identification_document_uploaded, // incprtr
      authorization_document_uploaded, // HST
      incorporation_status_id = 1,
    } = global.incStatusData;
    if (incorporation_status_id == 1) {
      if (hst_registration || authorization_document_uploaded) {
        navigation.navigate('HSTRegistration');
      } else if (identification_document_uploaded) {
        navigation.navigate('IncorporatorsList');
      } else {
        navigation.navigate('IncorporationLanding');
      }
    }
  };

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: props.marginTop,
      }}>
      <Heading value={'INCORPORATION'} marginTop={10} />
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="STATUS OF FILE :"
      />
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.APP_BLUE_HEADING_COLOR}
        value={incorporation_status_name}
        marginTop={2}
      />
      <Text
        style={{
          textAlign: 'left',
          color: Colors.BLACK,
          fontSize: 17,
          width: '100%',
          fontWeight: '400',
          marginTop: 30,
        }}>
        {status_description}
      </Text>
      <SKButton
        fontSize={16}
        marginTop={30}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.SECONDARY_FILL}
        borderColor={Colors.PRIMARY_BORDER}
        title={'EDIT INFO'}
        onPress={() => {
          incorpMoveToPage();
        }}
      />
    </View>
  );
};
const AllSet = props => {
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(false)
  const {incorporation_status_name, status_description} = global.incStatusData;
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
       { isLoading && <SKLoader/>}
      <Heading value={incorporation_status_name} marginTop={100} />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value={status_description}
      />
      <SKButton
        marginTop={56}
        fontSize={16}
        fontWeight={'normal'}
        width="100%"
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'DOWNLOAD DOCS'}
        onPress={() => {
          // TO DO 
          setIsLoading(true)
          const {user_id} = global.onlineStatusData
          const params = {User_Id:user_id}
          getIncorporationDocs(params,(incorpDocsRes) =>{
            setIsLoading(false)
            if(incorpDocsRes?.data?.length){
              navigation.navigate('HomeDocsListing',{page_id:2,page_title:'INCORPORATION DOCS', docs:incorpDocsRes?.data})
            }else{
              Alert.alert('Sukhtax','There is no document.')
            }
          })
        }}
      />
       <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.APP_BLUE_HEADING_COLOR}
          borderColor={Colors.CLR_D3D3D9}
          title={'NEW REQUEST'}
          onPress={() => {
            navigation.navigate('IncorporationLanding');
          }}
        />
      
      <DarkBlueButton
        title={'RETURN TO DASHBOARD'}
        onClick={() => {
          navigation.popToTop();
        }}
      />
      <SKButton
        fontSize={16}
        marginTop={30}
        width="50%"
        fontWeight={'normal'}
        backgroundColor={Colors.SECONDARY_FILL}
        borderColor={Colors.PRIMARY_BORDER}
        title={'RATE US'}
        onPress={() => {
          //MOVE FOR RATING..
          const appLink =
            Platform.OS == 'ios'
              ? 'https://apps.apple.com/ca/app/sukh-tax/id1551644082'
              : 'https://play.google.com/store/apps/details?id=com.ushatek.sukhtax&hl=en_US&gl=US';
          Linking.canOpenURL(appLink).then(
            supported => {
              supported && Linking.openURL(appLink);
            },
            err => console.log(err),
          );
        }}
      />
    </View>
  );
};
const InProcess = props => {
  const {navigation} = props;
  const {incorporation_status_name, status_description} = global.incStatusData;
  const openLink = () => {
    const {company_contact_number} = global.incStatusData;
    let finalLink = company_contact_number;
    if (Platform.OS == 'ios') {
      finalLink = `telprompt:${finalLink}`;
    } else {
      finalLink = `tel:${finalLink}`;
    }
    Linking.canOpenURL(finalLink)
      .then(supported => {
        if (!supported) {
          Alert.alert('SukhTax', 'Currently not availble');
        } else {
          return Linking.openURL(finalLink);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        paddingHorizontal: 20,
      }}>
      <Heading value={incorporation_status_name} marginTop={100} />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value={status_description}
      />
      <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        iconcolor={Colors.WHITE}
        rightImage={CustomFonts.Phone}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'CALL US'}
        onPress={() => {
          openLink();
        }}
      />
      <DarkBlueButton
        title={'RETURN TO DASHBOARD'}
        onClick={() => {
          navigation.popToTop();
        }}
      />
    </View>
  );
};

export default IncorpApplyStatus;
