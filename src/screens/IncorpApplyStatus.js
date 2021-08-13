import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton,{DarkBlueButton} from '../components/SKButton';
import {useIsFocused} from '@react-navigation/native';

const IncorpApplyStatus = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    incorporation_status_name = 'File not Submitted',
    status_description = 'Looks like you have to complete your registration and upload document still!',
    new_message_count = 0,
    incorporation_status_id,
  } = global.incStatusData;
  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);
  
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
          paddingBottom: Platform.OS == 'ios' ? 100 : 0,
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
        {incorporation_status_id == 3 &&
        <AllSet
        incorporation_status_name={incorporation_status_name}
        status_description={status_description}
        new_message_count={new_message_count}
        navigation={navigation}
      />}
        
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
  const moveToPage = props => {
    const {
      years_selected = 0,
      identification_document_uploaded = 0,
      about_info_filled = 0,
      banking_family_info_filled = 0,
      dependent_info_filled = 0,
      spouse_info_filled = 0,
      my_year_info_filled = 0,
      document_uploaded = 0,
      authorization_document_uploaded = 0,
    } = global.incStatusData;
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
      <MessegesView
        count={new_message_count}
        onClick={() => {
          navigation.navigate('Messages');
        }}
      />
    </View>
  );
};

const MessegesView = props => {
  const {count} = props;
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.APP_RED_SUBHEADING_COLOR, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 90,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClick && props.onClick();
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            MESSAGES :
          </Text>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            {`${count} NEW MESSAGES`}
          </Text>
        </View>
        <Image
          resizeMode="contain"
          style={{
            width: 42,
            height: 38,
          }}
          source={CustomFonts.messeges}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const AllSet = props => {
  const {navigation} = props;
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <Heading value="ALL SET!" marginTop={100} />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="YOU'RE READY TIORUY GET STARTED WITH YOUR BUSINESS!"
      />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="SUKHTAX WISHES YOU ALL THE BEST IN THIS NEW VENTURE!"
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
          navigation.navigate('AllDocuments');
        }}
      />
      <SKButton
        fontSize={16}
        marginTop={30}
        width="100%"
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
      <DarkBlueButton
      title={'RETURN TO HOME'}
      onClick = {()=>{
        navigation.popToTop();
      }}
      />
    </View>
  );
};
const InProcess = props => {
  const {navigation} = props;
  const openLink = () => {
    const {company_contact_number} = global.incStatusData
    let finalLink = company_contact_number
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
      <Heading value="IN PROCESS" marginTop={100} />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="THANK YOU FOR PROVIDING US WITH ALL RELEVANT INFORMATION. WE ARE WORKING HARD TO COMPLETE YOUR REQUEST"
      />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="SHOULD YOU HAVE ANY QUESTIONS DURING THIS PROCESS, PLEASE CALL US USING THE BUTTON BELOW:"
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
      title={'RETURN TO HOME'}
      onClick = {()=>{
        navigation.popToTop();
      }}
      />
    </View>
  );
};

export default IncorpApplyStatus;
