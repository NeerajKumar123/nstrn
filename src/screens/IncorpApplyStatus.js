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
import SKButton, {DarkBlueButton} from '../components/SKButton';
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
    const {
      hst_registration, // HST
      identification_document_uploaded, // incprtr
      authorization_document_uploaded, // HST
      incorporation_status_id,
    } = global.incStatusData;
    if (incorporation_status_id == 1) {
      if (hst_registration || authorization_document_uploaded) {
        navigation.navigate('HSTRegistration');
      } else if (identification_document_uploaded) {
        navigation.navigate('IncorporatorsList');
      } else {
        navigation.navigate('OnlineReturnLanding');
      }
    } else if (incorporation_status_id == 2) {
      navigation.navigate('IncorpInProcessScreen');
    } else if (incorporation_status_id == 3) {
      navigation.navigate('IncorpAllSet');
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
  const {incorporation_status_name, status_description} = global.incStatusData;
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
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
        onClick={() => {
          navigation.popToTop();
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
        title={'RETURN TO HOME'}
        onClick={() => {
          navigation.popToTop();
        }}
      />
    </View>
  );
};

export default IncorpApplyStatus;
