import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import SKButton from '../components/SKButton';
const CRALanding = props => {
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
        <Heading value="CRA LETTERS" marginTop={100} />
        <View>
        <KeyValueView marginTop={10} titleColor = {Colors.APP_RED_SUBHEADING_COLOR} subtitleColor = {Colors.APP_RED_SUBHEADING_COLOR}  title="LETTER" value="STATUS" />
      <KeyValueView marginTop={10} titleColor = {Colors.APP_BLUE_HEADING_COLOR} subtitleColor = {Colors.APP_BLUE_HEADING_COLOR} title="GST NOTICE" value="IN PROCESS" />
      <KeyValueView marginTop={10} titleColor = {Colors.APP_BLUE_HEADING_COLOR} subtitleColor = {Colors.APP_BLUE_HEADING_COLOR} title="TUTION FEES" value="RESOLVED" />
      <KeyValueView marginTop={10} titleColor = {Colors.APP_BLUE_HEADING_COLOR} subtitleColor = {Colors.APP_BLUE_HEADING_COLOR} title="NOA" value="RESOLVED" />
        </View>
        <SKButton
        marginTop={56}
        fontSize={16}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'NEW CRA LETTER'}
        onPress={() => {
          navigation.navigate('IncorpInProcess')
        }}
      />
    </ScrollView>
    </View>
  );
};


const KeyValueView = props => {
    const {marginTop = 0, titleColor = Colors.APP_BLUE_HEADING_COLOR, subtitleColor = Colors.APP_BLUE_HEADING_COLOR} = props
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: marginTop,
      }}>
      <Text style={{fontWeight: '700', fontSize: 20, color: titleColor}}>
        {props.title}
      </Text>
      <Text style={{fontWeight: '700', fontSize: 20, color: subtitleColor}}>
        {props.value}
      </Text>
    </View>
  );
};

export default CRALanding;
