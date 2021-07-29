import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import * as CustomFonts from '../constants/FontsDefs';
const download = require('../../assets/download.png');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentViewer from '../components/DocumentViewer';
const HomeDocsListing = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const {docs} = pageParams;
  const [groupedDocs, setGroupedDocs] = useState();
  const [showDoc, setShowDoc] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  useEffect(() => {
    const {docs} = pageParams;
    let yr21Docs = docs?.filter(doc => doc.year == 2021);
    let yr20Docs = docs?.filter(doc => doc.year == 2020);
    let yr19Docs = docs?.filter(doc => doc.year == 2019);
    let yr18Docs = docs?.filter(doc => doc.year == 2018);
    const tempArry = [];
    if (yr21Docs?.length) {
      tempArry.push({title: '2021 DOC', data: yr21Docs});
    }
    if (yr20Docs?.length) {
      tempArry.push({title: '2020 DOC', data: yr20Docs});
    }
    if (yr19Docs?.length) {
      tempArry.push({title: '2019 DOC', data: yr19Docs});
    }
    if (yr18Docs?.length) {
      tempArry.push({title: '2018 DOC', data: yr18Docs});
    }
    setGroupedDocs(tempArry);
  }, []);
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
        }}>
        <Heading value={pageParams?.page_title} marginTop={124} />
        <Heading
          fontSize={16}
          marginTop={15}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="PLEASE SEE LIST BELOW :"
        />
        {groupedDocs && groupedDocs.length > 0 && (
          <FlatList
            style={{width: '100%', marginTop: 20}}
            data={groupedDocs}
            keyExtractor={(item, index) => 'key_' + index}
            renderItem={({item}) => (
              <TaxReturnCard
                item={item}
                key = {item.document_file_name}
                marginTop={23}
                onDocClicked={doc => {
                  setSelectedItem(doc);
                  setShowDoc(true);
                }}
              />
            )}
          />
        )}
      </ScrollView>
      {showDoc && (
        <DocumentViewer onClose={() => setShowDoc(false)} item={selectedItem} />
      )}
    </View>
  );
};

const TaxReturnCard = props => {
  const {title, data} = props.item;
  const [isExpanded, setIsExpanded] = useState();
  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 11,
        flexDirection: 'column',
        marginTop: props.marginTop,
        borderBottomWidth: 1,
        borderBottomColor: Colors.CLR_00000020,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'left',
            color: Colors.APP_BLUE_HEADING_COLOR,
            fontSize: 17,
            fontWeight: '700',
          }}>
          {title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsExpanded(!isExpanded);
          }}>
          <Icon
            style={{marginRight: 20}}
            name={isExpanded ? CustomFonts.ChevronUp : CustomFonts.ChevronDown}
            size={30}
            color={Colors.PRIMARY_FILL}
          />
        </TouchableOpacity>
      </View>
      {isExpanded &&
        data.map((item, index) => {
          return (
            <FileCard
              item={item}
              onClick={() => {
                props.onDocClicked(item);
              }}
            />
          );
        })}
    </View>
  );
};

const FileCard = props => {
  const {item, onClick} = props;
  const array = item.document_file_name?.split('/');
  const [lastItem] = array.slice(-1);
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
      }}
      onPress={() => {
        onClick();
      }}>
      <Text
        style={{
          textAlign: 'left',
          color: Colors.BLACK,
          fontSize: 15,
          fontWeight: '400',
          flex: 1,
        }}>
        {lastItem}
      </Text>
      <Image
        resizeMode="contain"
        style={{width: 20, height: 20, marginLeft: 10}}
        source={download}
      />
    </TouchableOpacity>
  );
};

export default HomeDocsListing;
