import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton from '../components/SKButton';
import * as CustomFonts from '../constants/FontsDefs';

const IncorpInProcess = props => {
  const [isPaynow, setIsPaynow] = useState(false);
  const [status, setStatus] = useState(1);
  const navigation = useNavigation();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation = {navigation}/>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="PAYMENTS" marginTop={100} />
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
          navigation.popToTop()
        }}
      />
    </ScrollView>
    </View>
  );
};

export default IncorpInProcess;
