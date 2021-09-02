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
import DocumentViewer from '../components/DocumentViewer';

const CRAAttachments = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [showDoc, setShowDoc] = useState(false);
  const {attachments, title, cra_letters_status_name} = pageParams;
  const [selectedItem, setSelectedItem] = useState();

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
          {attachments && attachments.length > 0 && 
          <Heading value={'ATTACHMENTS'} marginTop={50} />
          }
        
        <Heading
          fontSize={18}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={title.toUpperCase()}
          marginTop={20}
        />
        <KeyValueView
          fontSize={18}
          title={'STATUS OF LETTER : '}
          value={cra_letters_status_name}
          marginTop={20}
          marginBottom = {20}
          titleColor={Colors.APP_BLUE_HEADING_COLOR}
          subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
        />
        {attachments &&
          attachments.map((item, index) => {
            return ( 
            <FileCard key = {item.document_title}  item ={item} 
            onClick = {() =>{
              setSelectedItem(item);
              setShowDoc(true);
            }}/>)
          })}
        {/* <SKButton
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
        /> */}
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          iconcolor={Colors.WHITE}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
          title={'CRA HOME'}
          onPress={() => {
            navigation.navigate('CRALanding');
          }}
        />
      </View>
      {showDoc && (
        <DocumentViewer onClose={() => setShowDoc(false)} item={selectedItem} />
      )}
    </View>
  );
};

const FileCard = props => {
  const {item,onClick}  = props
  const {document_title} = item
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
        {document_title}
      </Text>
      <Image
        resizeMode="contain"
        style={{width: 20, height: 20, marginLeft: 10}}
        source={CustomFonts.download}
      />
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
