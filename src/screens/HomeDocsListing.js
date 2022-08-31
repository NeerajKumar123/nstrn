import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import * as CustomFonts from '../constants/FontsDefs';
const download = require('../../assets/download.png');
import {downloadFileFromUrl} from '../helpers/BaseUtility';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SKLoader from '../components/SKLoader';
import Lottie from 'lottie-react-native';
const loader = require('../../assets/loader.json');
const HomeDocsListing = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [groupedDocs, setGroupedDocs] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingiOS, setIsLoadingiOS] = useState(false);
  const [downloadingItem, setDownloadingItem] = useState();
  const pageId = pageParams?.page_id;

  useEffect(() => {
    const {docs, page_id} = pageParams;
    let yr22Docs = docs?.filter(doc => doc.year == 2022);
    let yr21Docs = docs?.filter(doc => doc.year == 2021);
    let yr20Docs = docs?.filter(doc => doc.year == 2020);
    let yr19Docs = docs?.filter(doc => doc.year == 2019);
    let yr18Docs = docs?.filter(doc => doc.year == 2018);
    const tempArry = [];

    
    if (yr22Docs?.length) {
      tempArry.push({title: '20222 DOC', data: yr22Docs});
    }
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
    if (page_id == 3) {
      setGroupedDocs([{title: 'DOCUMENTS', data: docs}]);
    } else {
      setGroupedDocs(tempArry);
    }
  }, []);

  const getFileName = docUrl => {
    const dateString = `${new Date().valueOf()}`;
    const loweredCase = docUrl?.toLowerCase();
    let fileName = 'Sukhtax_' + dateString;
    if (loweredCase.includes('.pdf')) {
      fileName = fileName + '.pdf';
    } else if (loweredCase.includes('.png')) {
      fileName = fileName + '.png';
    } else if (loweredCase.includes('.jpeg')) {
      fileName = fileName + '.jpeg';
    } else if (loweredCase.includes('.jpg')) {
      fileName = fileName + '.jpg';
    }
    return fileName;
  };

  const handleFileDownloading = (doc, callback) => {
    const docUrl = doc?.document_file_name?.replace(/ /g, '');
    const fileName = getFileName(docUrl);
    if (Platform.OS == 'android') {
      setIsLoading(true);
    } else {
      setIsLoadingiOS(true);
      setDownloadingItem(doc);
    }
    downloadFileFromUrl(docUrl, fileName, () => {
      console.log('docUrl====>',docUrl)
      if (Platform.OS == 'android') {
        setIsLoading(false);
      } else {
        setDownloadingItem(undefined);
        setIsLoadingiOS(false);
      }
      callback();
    });
  };

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
        <Heading value={pageParams?.page_title} marginTop={124} />
        <Heading
          fontSize={16}
          marginTop={15}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="PLEASE SEE LIST BELOW :"
        />
        {groupedDocs && groupedDocs.length > 0 && (
          <View>
            <FlatList
              style={{width: '100%', marginTop: 20}}
              data={groupedDocs}
              keyExtractor={(item, index) => 'key_' + index}
              renderItem={({item}) => (
                <TaxReturnCard
                  item={item}
                  key={item.document_file_name}
                  marginTop={23}
                  isLoadingiOS={isLoadingiOS}
                  downloadingItem={downloadingItem}
                  pageId={pageId}
                  onDocClicked={doc => {
                    handleFileDownloading(doc, () => {
                    });
                  }}
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const TaxReturnCard = props => {
  const {isLoadingiOS, downloadingItem, pageId, item} = props;
  const {title, data} = item;
  const [isExpanded, setIsExpanded] = useState();
  return (
    <TouchableOpacity
      onPress={() => {
        setIsExpanded(!isExpanded);
      }}
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
        <View
          onPress={() => {
            setIsExpanded(!isExpanded);
          }}>
          <Icon
            style={{marginRight: 20}}
            name={isExpanded ? CustomFonts.ChevronUp : CustomFonts.ChevronDown}
            size={30}
            color={Colors.PRIMARY_FILL}
          />
        </View>
      </View>
      {isExpanded &&
        data?.map((item, index) => {
          return (
            <FileCard
              key={item.document_file_name}
              item={item}
              isLoadingiOS={isLoadingiOS}
              downloadingItem={downloadingItem}
              pageId={pageId}
              onClick={() => {
                props.onDocClicked(item);
              }}
            />
          );
        })}
    </TouchableOpacity>
  );
};

const FileCard = props => {
  const {item, onClick, isLoadingiOS, downloadingItem, pageId} = props;
  let keyName = 'key';
  if (pageId == 1) {
    keyName = 'tax_file_document_id';
  } else if (pageId == 2) {
    keyName = 'incorporation_document_id';
  } else if (pageId == 3) {
    keyName = 'tax_docs_document_id';
  } else if (pageId == 4) {
    keyName = 'cra_letters_document_id';
  }
  const isSame = downloadingItem?.[keyName] == item?.[keyName];

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        height: 40,
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
        {item.document_title}
      </Text>
      {isLoadingiOS && isSame ? (
        <Lottie style={{width: 35, height: 35}} autoPlay loop source={loader} />
      ) : (
        <Image
          resizeMode="contain"
          style={{width: 25, height: 25, marginLeft: 10}}
          source={CustomFonts.download}
        />
      )}
    </TouchableOpacity>
  );
};

export default HomeDocsListing;
