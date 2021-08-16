import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton from '../components/SKButton';

const CRAAttachments = props => {
  const navigation = useNavigation();
  const [attachments, setAttachments] = useState([
    {name: 'ATTACHMENT1.PDF', id: 1},
    {name: 'ATTACHMENT1.PDF', id: 1},
    {name: 'ATTACHMENT1.PDF', id: 1},
    {name: 'ATTACHMENT1.PDF', id: 1},
  ]);
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Heading value={'ATTACHMENTS'} marginTop={50} />
        <Heading
          fontSize={18}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={'TITLE OF LETTER'}
          marginTop={20}
        />
        <KeyValueView
          fontSize={18}
          title={'STATUS OF LETTER : '}
          value={'RESOLVED'}
          marginTop={20}
          marginBottom = {20}
          titleColor={Colors.APP_BLUE_HEADING_COLOR}
          subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
        />
        {attachments &&
          attachments.map((item, index) => {
            return <FileCard />
          })}
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          iconcolor={Colors.WHITE}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
          title={'DOWNLOAD ALL'}
          onPress={() => {
            navigation.navigate('CRALanding');
          }}
        />
      </View>
    </View>
  );
};

const FileCard = props => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
      }}
      onPress={() => {
        onClick();
      }}>
      <Text
        style={{
          textAlign: 'left',
          color: Colors.APP_BLUE_HEADING_COLOR,
          fontSize: 15,
          fontWeight: '700',
          flex: 1,
        }}>
        {'ATTACHMENT1.PDF'}
      </Text>
    </TouchableOpacity>
  );
};

const KeyValueView = props => {
  const {
    marginTop = 0,
    marginBottom = 0,
    titleColor = Colors.APP_BLUE_HEADING_COLOR,
    subtitleColor = Colors.APP_BLUE_HEADING_COLOR,
  } = props;
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: marginTop,
        marginBottom:marginBottom
      }}>
      <Text style={{fontWeight: '700', fontSize: 18, color: titleColor}}>
        {props.title}
      </Text>
      <Text style={{fontWeight: '700', fontSize: 18, color: subtitleColor}}>
        {props.value}
      </Text>
    </View>
  );
};

export default CRAAttachments;
