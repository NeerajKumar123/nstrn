import React, {useState} from 'react';
import {TouchableOpacity,Linking, View, Text, ScrollView, Alert} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton,{DarkBlueButton} from '../components/SKButton';
import * as CustomFonts from '../constants/FontsDefs';

const IncorpInProcessScreen = props => {
  const navigation = useNavigation();
  const openLink = () => {
    const {company_contact_number} = global.incStatusData
    console.log('company_contact_number',company_contact_number)
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
        paddingHorizontal:20
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
        iconcolor = {Colors.WHITE}
        rightImage={CustomFonts.Phone}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'CALL US'}
        onPress={() => {
          openLink()
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

export default IncorpInProcessScreen;
