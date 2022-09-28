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
import {useIsFocused} from '@react-navigation/native';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {onlineGetTaxFileStatus, finalizeOnlineProcess} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const OnlineReturnLandingV3 = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [statusDetails, setStatusDetails] = useState({});

  useEffect(() => {
    console.log('isFocused',isFocused)
    if (isFocused) {
      getTaxFlStatus();
    }
  }, [isFocused]);

  const getTaxFlStatus = () => {
    const {user_id, tax_file_id} = global.onlineStatusData;
    console.log('user_id, tax_file_id',user_id, tax_file_id)
    if (user_id) {
      setIsLoading(true);
      const params = {User_Id: user_id, Tax_File_Id: tax_file_id};
      onlineGetTaxFileStatus(params, res => {
        setIsLoading(false);
        console.log('res', JSON.stringify(res));
        if (res?.status == 1) {
          setStatusDetails(res.data[0]);
        }
      });
    }
  };

  const checkFormValidations = () => {
    let isValidForm = true;
    const isProfileComplete = statusDetails?.tax_profile_completed
    const isYearSelected = statusDetails?.years_selected?.length;
    const isDocumentUploaded = statusDetails?.document_uploaded;
    if (!isProfileComplete) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please complete your profile first.');
    } else if (!isYearSelected) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please select year(s) you are filing for');
    }else if (!isDocumentUploaded) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please upload required documents first');
    }
    return isValidForm;
  };

  const onNewTaxFileIdCreated = ({tax_file_id, user_id}) =>{
    console.log('user_id, tax_file_id',user_id, tax_file_id)
    if (user_id) {
      setIsLoading(true);
      const params = {User_Id: user_id, Tax_File_Id: tax_file_id};
      onlineGetTaxFileStatus(params, res => {
        setIsLoading(false);
        console.log('res', JSON.stringify(res));
        if (res?.status == 1) {
          setStatusDetails(res.data[0]);
        }
      });
    }  }


  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="NEW ONLINE RETURN" marginTop={86} />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WELCOME TO THE SUKH TAX ONLINE FILING
          CENTRE. WE BELIEVE TAX FILING SHOULD BE
          EASY AND STRESS FREE."
        />
        <Heading
          fontSize={16}
          marginTop={55}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="PLEASE FOLLOW OUR 3 STEP APPROACH
          BELOW TO SUBMIT YOUR FILE AND WE WILL
          TAKE CARE OF THE REST."
        />
        <OnlineLandinButton
          title={'Complete or review profile'}
          isSelected={statusDetails?.tax_profile_completed}
          onSelected={() => {
            navigation.navigate('OnlineCompleteReviewProfileV3', {statusDetails:statusDetails, onBack:(details) =>{onNewTaxFileIdCreated(details)}});
          }}
        />
        <OnlineLandinButton
          title={'Select which years to file for'}
          isSelected={statusDetails?.years_selected?.length}
          selectedYears={statusDetails?.years_selected}
          onSelected={() => {
            navigation.navigate('OnlineSelectYearV3', {
              statusDetails: statusDetails,
            });
          }}
        />
        <OnlineLandinButton
          title={'Upload documents'}
          isSelected={statusDetails?.document_uploaded}
          onSelected={() => {
            navigation.navigate('OnlineDocumentUploadV3', {
              statusDetails: statusDetails,
            });
          }}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}>
          <SKButton
            fontSize={16}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'SUBMIT YOUR FILE'}
            rightImage={CustomFonts.right_arrow}
            onPress={() => {
              if (checkFormValidations()) {
                const {user_id, tax_file_id} = statusDetails;
                const params = {
                  User_Id: user_id,
                  Tax_File_Id: tax_file_id,
                };
                setIsLoading(true);
                finalizeOnlineProcess(params, finalizeRes => {
                  console.log('finalizeRes====>', finalizeRes);
                  setIsLoading(false);
                  navigation.popToTop();
                });  
              }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const OnlineLandinButton = props => {
  const {
    title,
    isSelected = false,
    isFiled = false,
    onSelected = () => {},
  } = props;
  return (
    <TouchableOpacity
      disabled={isFiled}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 48,
        opacity: isFiled ? 0.8 : 1,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: isFiled ? Colors.LIGHTGRAY : Colors.LIGHTGRAY,
        backgroundColor: isFiled ? Colors.CLR_FFECEC : Colors.CLR_FFECEC,
      }}
      key={`${Math.random()}`}
      onPress={() => {
        console.log('OnlineCompleteReviewProfileV3');
        onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: isFiled ? Colors.CLR_191919 : Colors.CLR_191919,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {title}
      </Text>
      <Icon
        style={{right: 20, position: 'absolute'}}
        name={
          isSelected ? CustomFonts.CheckRightFilled : CustomFonts.CheckRight
        }
        size={isSelected ? 20 : 20}
        color={isSelected ? Colors.GREEN : Colors.GRAY}
      />
    </TouchableOpacity>
  );
};

export default OnlineReturnLandingV3;
