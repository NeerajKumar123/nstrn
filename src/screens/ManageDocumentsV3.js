import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserDocuments, deleteDocument} from '../apihelper/Api';
import SKLoader from '../components/SKLoader';
import {downloadFileFromUrl} from '../helpers/BaseUtility';
import Lottie from 'lottie-react-native';
const loader = require('../../assets/loader.json');

const ManageDocumentsV3 = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [docs, setDocs] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingiOS, setIsLoadingiOS] = useState(false);
  const [downloadingItem, setDownloadingItem] = useState();

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    setIsLoading(true);
    const {user_id, tax_file_id} = pageParams;
    const params = {User_Id: user_id, Tax_File_Id: tax_file_id};
    getUserDocuments(params, docsRes => {
      setIsLoading(false);
      if (docsRes?.status == 1) {
        setDocs(docsRes.data);
      } else {
        Alert.alert('SukhTax', 'Something went wrong.');
      }
    });
  };

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
        flex: 1,
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%', flex: 1}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}>
        <Heading value="MANAGE DOCUMENTS" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="SEE BELOW FOR ALL DOCUMENTS UPLOADED"
        />
        {docs && docs.length < 1 && (
          <Heading
            fontSize={20}
            textAlign="center"
            marginTop={50}
            color={Colors.GRAY}
            value="THERE IS NO DOCUMENTS TO SHOW"
          />
        )}
        {docs &&
          docs.map((item, index) => {
            return (
              <ManageDocCard
                item={item}
                key={`${item.tax_file_document_id}`}
                isLoadingiOS={isLoadingiOS}
                downloadingItem={downloadingItem}
                onOpen={() => {
                  handleFileDownloading(item, () => {});
                }}
                onDelete={() => {
                  const options = [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                    },
                    {
                      text: 'Delete',
                      onPress: () => {
                        const {user_id, tax_file_id} = pageParams;
                        const params = {
                          User_Id: user_id,
                          Tax_File_Id: tax_file_id,
                          Tax_File_Document_Id: item.tax_file_document_id,
                        };
                        setIsLoading(true);
                        deleteDocument(params, delRes => {
                          getDocs();
                        });
                      },
                    },
                  ];
                  Alert.alert(
                    'SukhTax',
                    'Are you sure you want to delete this document?',
                    options,
                  );
                }}
              />
            );
          })}
        {pageParams.showFooterBtn && docs && docs.length > 0 && (
          <SKButton
            disable={!pageParams.isDocAdded}
            fontSize={16}
            marginTop={30}
            rightImage={CustomFonts.right_arrow}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'AUTHORIZATION'}
            onPress={() => {
              navigation.navigate('AuthorizerList');
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const ManageDocCard = props => {
  const {
    item,
    height = 44,
    fontSize = 15,
    onOpen,
    onDelete,
    isLoadingiOS,
    downloadingItem,
  } = props;
  
  const isSame =
  downloadingItem?.document_title == item.document_title;
  
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 15,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
        minHeight: height,
        backgroundColor: Colors.WHITE,
        elevation: 2,
        backgroundColor: Colors.WHITE,
        shadowColor: Colors.LIGHTGRAY,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.8,
        paddingHorizontal: 16,
      }}>
      <TouchableOpacity
        onPress={() => {
          onOpen && onOpen();
        }}>
        <Text
          style={{
            textAlign: 'left',
            color: Colors.APP_BLUE_HEADING_COLOR,
            fontSize: fontSize,
            fontWeight: '500',
            fontFamily: CustomFonts.OpenSansRegular,
          }}>
          {item.document_title}
        </Text>
      </TouchableOpacity>
      {isLoadingiOS && isSame && (
        <Lottie style={{width: 35, height: 35}} autoPlay loop source={loader} />
      )}
      {!(isLoadingiOS && isSame) && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            width: 40,
            height: '100%',
            alignItems: 'flex-end',
          }}
          onPress={() => {
            onDelete && onDelete();
          }}>
          <Icon
            style={{right: 10, position: 'absolute'}}
            name={'close-circle-outline'}
            size={30}
            color={Colors.RED}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ManageDocumentsV3;
