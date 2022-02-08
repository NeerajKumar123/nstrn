import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  Linking,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton, {DarkBlueButton} from '../components/SKButton';
import DocumentViewer from '../components/DocumentViewer';
import SKLoader from '../components/SKLoader';
import {downloadFileFromUrl} from '../helpers/BaseUtility';
import {useIsFocused} from '@react-navigation/native';
import {taxDocsGetReqDocs,getTaxAuthDocs, taxDocsSubmitForFiling, EversingSuccess,
  EversingFailed,
  createEvenrSignDoc,
} from '../apihelper/Api';
import Lottie from 'lottie-react-native';
const loader = require('../../assets/loader.json');

const RequestApplyStatus = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const shouldGoToHome = pageParams?.shouldGoToHome;
  const {
    tax_docs_status_name = 'File not Submitted',
    new_message_count = 0,
    tax_docs_status_id = 1,
  } = global.taxDocsStatusData;

  let status = global.taxDocsStatusData?.status_description;
  status = status?.split('$').join('\n');
  const status_description = status || '';

  const [docs, setDocs] = useState();
  const [showDoc, setShowDoc] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingiOS, setIsLoadingiOS] = useState(false);
  const [downloadingItem, setDownloadingItem] = useState();
  const isFocused = useIsFocused();
  const [confirmDocs, setConfirmDocs] = useState();

  useEffect(() => {
    const {user_id, tax_docs_id, tax_docs_status_id} = global.taxDocsStatusData;
    if (tax_docs_status_id == 3) {
      const params = {User_Id: user_id, Tax_Docs_Id: tax_docs_id};
      taxDocsGetReqDocs(params, docsRes => {
        if (docsRes?.status == 1) {
          setDocs(docsRes.data);
        } else {
          const msg =
            docsRes?.message ?? 'Something went wront, Please try again later.';
          Alert.alert('SukhTax', msg);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isFocused && tax_docs_status_id == 4) {
      setIsLoading(true);
      const {user_id, tax_docs_id} = global.taxDocsStatusData;
      const params = {User_Id: user_id, Tax_Docs_Id: tax_docs_id};
      getTaxAuthDocs(params, confDocs => {
       setTimeout(() => {
        setIsLoading(false);
       }, 200);
        if (confDocs?.status == 1) {
          setConfirmDocs(confDocs.data);
        }
      });
    }
  }, [isFocused]);



  const getFile = document => {
    let file = {};
    file['name'] = document.title;
    file['file_url'] = document.document_file_name;
    file['file_id'] = document.tax_file_confirmation_id;
    file['file_base64'] = '';
    return file;
  };
  const getSigner = () => {
    const {email = 'rahbar.fatmi@21gfox.com'} = global.userInfo;
    const user = global.userInfo;
    const fName = user?.firstname ?? '';
    const lName = user?.lastname ?? '';
    const userFullName = fName + ' ' + lName;

    let signer = {};
    signer['id'] = 1;
    signer['name'] = userFullName;
    signer['email'] = email;
    signer['pin'] = '';
    signer['message'] = '';
    signer['language'] = 'en';
    return signer;
  };

  const recipient = () => {
    let recipient = {};
    recipient['name'] = 'Rahber Fatmi';
    recipient['email'] = 'rahber.fatmi@21gfox.com';
    recipient['language'] = 'en';
    return recipient;
  };

  const getFields = document => {
    let fields = [];
    document?.Fields?.forEach(element => {
      let field = {};
      field['type'] = element?.field_type;
      field['x'] = element?.x_coordinate;
      field['y'] = element?.y_coordinate;
      field['width'] = element?.width;
      field['height'] = element?.height;
      field['page'] = element?.page;
      field[
        'identifier'
      ] = `${element.field_type}${element.x_coordinate}${element.x_coordinate}`;
      field['required'] = 1;
      field['readonly'] = 0;
      field['signer'] = 1;
      field['name'] = '';
      field['validation_type'] = '';
      field['text_size'] = '';
      field['text_font'] = '';
      field['text_font'] = '';
      field['text_style'] = '';
      field['value'] = '';
      field['options'] = [];
      field['group'] = '';
      fields.push(field);
    });
    return fields;
  };

  

  const prepareParams = document => {
    let params = {};
    params['sandbox'] = 0;
    params['is_draft'] = 0;
    params['embedded'] = 1;
    params['title'] = 'Sukhtax Confirmation';
    params['message'] = 'This is my general document message.';
    params['use_signer_order'] = 0;
    params['reminders'] = 1;
    params['require_all_signers'] = 1;
    params['custom_requester_name'] = 'Sukhtax';
    params['custom_requester_email'] = 'sukhtaxit@gmail.com';
    params['redirect'] = EversingSuccess;
    params['redirect_decline'] = EversingFailed;
    params['client'] = '';
    params['expires'] = '';
    params['embedded_signing_enabled'] = 1;
    params['flexible_signing'] = 0;
    params['use_hidden_tags'] = 0;
    params['files'] = [getFile(document)];
    params['signers'] = [getSigner()];
    params['recipients'] = [];
    params['fields'] = [getFields(document)];
    return params;
  };

  const checkIfAllDocsSigned = () => {
    const unsingedDocs = confirmDocs.filter(function (item) {
      return (
        item?.eversign_document_hash == '' ||
        item?.eversign_document_hash == null ||
        item?.eversign_document_hash?.length < 1
      );
    });
    return unsingedDocs?.length > 0 ? false : true;
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
        width: '100%',
      }}>
      <AppHeader
        navigation={navigation}
        onLeftClicked={() => {
          if (shouldGoToHome) {
            navigation.popToTop();
          } else {
            navigation.goBack();
          }
        }}
      />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
          paddingBottom: Platform.OS == 'ios' ? 100 : 0,
        }}>
        {isLoading && <SKLoader />}
        {tax_docs_status_id == 1 && (
          <NotSubmitted
            tax_docs_status_name={tax_docs_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
            marginTop={25}
          />
        )}
        {tax_docs_status_id == 2 && (
          <InProcess
            tax_docs_status_name={tax_docs_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
          />
        )}
        {tax_docs_status_id == 3 && (
          <AllSet
            reqDocs={docs}
            tax_docs_status_name={tax_docs_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
            isLoadingiOS={isLoadingiOS}
            downloadingItem={downloadingItem}
            onDocClicked={item => {
              setSelectedItem(item);
              // setShowDoc(true);
              handleFileDownloading(item, () => {
              });
            }}
            onAllDownloadClicked={() => {
              const {user_id, tax_docs_id, tax_docs_status_id} =
                global.taxDocsStatusData;
              if (tax_docs_status_id == 3) {
                const params = {User_Id: user_id, Tax_Docs_Id: tax_docs_id};
                taxDocsGetReqDocs(params, docsRes => {
                  if (docsRes?.status == 1) {
                    navigation.navigate('HomeDocsListing', {
                      page_id: 3,
                      page_title: 'T1 GENERAL, NOA, T-SLIPS',
                      docs: docsRes?.data,
                    });
                  } else {
                    Alert.alert('Sukhtax', 'There is no document.');
                  }
                });
              }
            }}
          />
        )}
        {tax_docs_status_id == 4 && confirmDocs?.length > 0 && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}>
          <FlatList
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            style={{width: '100%', marginTop: 20}}
            data={confirmDocs}
            keyExtractor={(item, index) => index + '_key'}
            ItemSeparatorComponent={() => (
              <View style={{width: 20, backgroundColor: 'pink'}} />
            )}
            renderItem={({item, index}) => (
              <SKButton
                fontSize={16}
                marginTop={10}
                width={'100%'}
                iconsize={20}
                rightImage={
                  item?.eversign_document_hash?.length > 0
                    ? CustomFonts.CheckRight
                    : CustomFonts.ChevronRight
                }
                fontWeight={'normal'}
                backgroundColor={Colors.CLR_7F7F9F}
                borderColor={Colors.CLR_D3D3D9}
                title={item?.title}
                onPress={() => {
                  if (item?.eversign_document_hash?.length < 1) {
                    const params = prepareParams(item);
                    setIsLoading(true)
                    createEvenrSignDoc(params, res => {
                      setTimeout(() => {
                        setIsLoading(false)
                      }, 500);
                      if (res?.signers && res?.signers?.length > 0) {
                        const dochash = res?.document_hash;
                        const signer = res?.signers?.[0];
                        const signingUrl = signer.embedded_signing_url;

                        navigation.navigate('SKWebPage', {
                          pageUrl: signingUrl,
                          noOfDocs: confirmDocs?.length,
                          currentIndex: index + 1,
                          doc: item,
                          dochash: dochash,
                          saveType:2
                        });
                      } else {
                        Alert.alert(
                          'Sukhtax',
                          'Something went wrong, Please try again.',
                        );
                      }
                    });
                  } else {
                    Alert.alert('Sukhtax', 'Document is already signed.');
                  }
                }}
              />
            )}
          />
        </View>
      )}
      {tax_docs_status_id == 4 && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'SUBMIT'}
          onPress={() => {
            if (checkIfAllDocsSigned()) {
              const {user_id, tax_docs_id} = global.taxDocsStatusData;
              const params = {User_id: user_id, Tax_Docs_Id: tax_docs_id};
              setIsLoading(true)
              taxDocsSubmitForFiling(params, submitFileRes => {
                setTimeout(() => {
                  setIsLoading(false)
                }, 200);
                if (submitFileRes?.status) {
                  navigation.goBack();
                }
              });
            } else {
              Alert.alert(
                'Sukhtax',
                'Please sign all the required documents listed above.',
              );
            }
          }}
        />
      )}

{tax_docs_status_id == 5 && (
          <InProcess
            tax_docs_status_name={tax_docs_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
          />
        )}
      </ScrollView>
      {showDoc && (
        <DocumentViewer onClose={() => setShowDoc(false)} item={selectedItem} />
      )}
    </View>
  );
};

const NotSubmitted = props => {
  const {navigation, tax_docs_status_name, status_description} = props;

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: props.marginTop,
      }}>
      <Heading value={'TAX DOCUMENTS'} marginTop={10} />
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
        value={tax_docs_status_name}
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
    </View>
  );
};
const AllSet = props => {
  const {
    navigation,
    tax_docs_status_name,
    status_description,
    reqDocs,
    onDocClicked,
    isLoadingiOS,
    downloadingItem,
  } = props;
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <Heading value={tax_docs_status_name} marginTop={100} />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value={status_description}
      />
      {reqDocs &&
        reqDocs.map((item, index) => {
          return (
            <FileCard
              key={item.document_title}
              isLoadingiOS={isLoadingiOS}
              downloadingItem={downloadingItem}
              item={item}
              onClick={() => {
                onDocClicked(item);
              }}
            />
          );
        })}
      <SKButton
        fontSize={16}
        marginTop={30}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.APP_BLUE_HEADING_COLOR}
        borderColor={Colors.CLR_D3D3D9}
        title={'NEW REQUEST'}
        onPress={() => {
          navigation.navigate('RequestLanding');
        }}
      />
      <DarkBlueButton
        title={'RETURN TO DASHBOARD'}
        onClick={() => {
          navigation.popToTop();
        }}
      />
      <SKButton
        fontSize={16}
        marginTop={30}
        width="50%"
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
    </View>
  );
};
const InProcess = props => {
  const {navigation, tax_docs_status_name, status_description} = props;
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
      <Heading value={tax_docs_status_name} marginTop={100} />
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
        title={'RETURN TO DASHBOARD'}
        onClick={() => {
          navigation.popToTop();
        }}
      />
    </View>
  );
};

const FileCard = props => {
  const {item, onClick, isLoadingiOS = false, downloadingItem} = props;
  const isSame =
    downloadingItem?.tax_docs_document_id == item?.tax_docs_document_id;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
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

export default RequestApplyStatus;
