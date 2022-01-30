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
  FlatList,
} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton, {DarkBlueButton} from '../components/SKButton';
import {
  craLattersGetDetails,
  getcraAuthDocs,
  craLettersSubmitForFiling,
  EversingSuccess,
  EversingFailed,
  createEvenrSignDoc,
} from '../apihelper/Api';
import {downloadFileFromUrl} from '../helpers/BaseUtility';
import Lottie from 'lottie-react-native';
import {useIsFocused} from '@react-navigation/native';
const loader = require('../../assets/loader.json');

const CRALattersStatus = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [status, setStatus] = useState(1);
  const [details, setDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [confirmDocs, setConfirmDocs] = useState();

  useEffect(() => {
    const {user_id, cra_letters_id} = pageParams;
    const params = {User_Id: user_id, CRA_Letter_Id: cra_letters_id};
    setIsLoading(true);
    craLattersGetDetails(params, detailsRes => {
      if (detailsRes?.status == 1) {
        const data = detailsRes?.data?.length > 0 ? detailsRes?.data[0] : {};
        setDetails(data);
        setStatus(data.cra_letters_status_id);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      const {user_id, cra_letters_id} = pageParams;
      const params = {User_Id: user_id, CRA_Letters_Id: cra_letters_id};
      getcraAuthDocs(params, confDocs => {
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
    // console.log('document',document)
    let fields = [];
    document?.Fields?.forEach(element => {
      console.log('element', element);
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
    console.log('fields==>', fields);
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
    const unsingedDocs = confirmDocs?.filter(function (item) {
      return (
        item?.eversign_document_hash == '' ||
        item?.eversign_document_hash == null ||
        item?.eversign_document_hash?.length < 1
      );
    });
    console.log('unsingedDocs?.length', unsingedDocs?.length);
    return unsingedDocs?.length > 0 ? false : true;
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
          paddingBottom: Platform.OS == 'ios' ? 100 : 0,
        }}>
        {details && status == 1 && (
          <InProcess details={details} navigation={navigation} />
        )}
        {details && status == 2 && (
          <InProcess details={details} navigation={navigation} marginTop={25} />
        )}
        {details && status == 3 && (
          <Resolved details={details} navigation={navigation} />
        )}
        {details && status == 4 && (
          <Rejected details={details} navigation={navigation} />
        )}
        {status == 5 && confirmDocs?.length > 0 && (
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
                      setIsLoading(true);
                      createEvenrSignDoc(params, res => {
                        setTimeout(() => {
                          setIsLoading(false);
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
                            saveType: 3,
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
        {status == 5 && (
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
                const {user_id, cra_letters_id} = pageParams;
                const params = {
                  User_id: user_id,
                  CRA_Letters_Id: cra_letters_id,
                };
                setIsLoading(true);
                craLettersSubmitForFiling(params, submitFileRes => {
                  setTimeout(() => {
                    setIsLoading(false);
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
        {details && status == 6 && (
          <InProcess details={details} navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
};

const InProcess = props => {
  const {navigation, details} = props;
  const {cra_letters_status_name, status_description, title} = details;
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <Heading value={'CRA LETTER'} marginTop={50} />
      <Heading
        fontSize={20}
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value={title?.toUpperCase()}
        marginTop={20}
      />
      <KeyValueView
        fontSize={20}
        title={'STATUS OF LETTER : '}
        value={cra_letters_status_name}
        marginTop={20}
        titleColor={Colors.APP_RED_SUBHEADING_COLOR}
        subtitleColor={Colors.APP_BLUE_HEADING_COLOR}
      />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_BLUE_HEADING_COLOR}
        value={status_description}
      />
      <SKButton
        marginTop={56}
        fontSize={16}
        fontWeight="normal"
        width="50%"
        iconcolor={Colors.WHITE}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'CRA HOME'}
        onPress={() => {
          navigation.navigate('CRALanding');
        }}
      />
    </View>
  );
};

const Rejected = props => {
  const {navigation, details} = props;
  const {cra_letters_status_name, status_description, title} = details;

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <Heading value={'CRA LETTER'} marginTop={50} />
      <Heading
        fontSize={20}
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value={title.toUpperCase()}
        marginTop={20}
      />
      <KeyValueView
        fontSize={20}
        title={'STATUS OF LETTER : '}
        value={cra_letters_status_name}
        marginTop={20}
        titleColor={Colors.APP_RED_SUBHEADING_COLOR}
        subtitleColor={Colors.APP_BLUE_HEADING_COLOR}
      />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_BLUE_HEADING_COLOR}
        value={status_description}
      />
      {details.Sukh_Tax_Reply && (
        <Heading
          fontSize={17}
          marginTop={12}
          fontWeight="700"
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={'SUKH TAX REPLY'}
        />
      )}

      {details.Sukh_Tax_Reply &&
        details.Sukh_Tax_Reply.map((item, index) => {
          return (
            <Heading
              key={item.reply}
              fontSize={18}
              marginTop={12}
              fontWeight="700"
              color={Colors.APP_BLUE_HEADING_COLOR}
              value={item.reply}
            />
          );
        })}
      <SKButton
        marginTop={56}
        fontSize={16}
        width="50%"
        fontWeight="normal"
        iconcolor={Colors.WHITE}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'CRA HOME'}
        onPress={() => {
          navigation.navigate('CRALanding');
        }}
      />
    </View>
  );
};

const Resolved = props => {
  const {navigation, details} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingiOS, setIsLoadingiOS] = useState(false);
  const [downloadingItem, setDownloadingItem] = useState();
  const {cra_letters_status_name, status_description, title} = details;

  const getFileName = docUrl => {
    const dateString = `${new Date().valueOf()}`;
    console.log(dateString);
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
      callback();
      if (Platform.OS == 'android') {
        setIsLoading(false);
      } else {
        setDownloadingItem(undefined);
        setIsLoadingiOS(false);
      }
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
      <Heading value={'CRA LETTER'} marginTop={50} />
      {isLoading && <SKLoader />}
      <Heading
        fontSize={20}
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value={title.toUpperCase()}
        marginTop={20}
      />
      <KeyValueView
        fontSize={20}
        title={'STATUS OF LETTER : '}
        value={cra_letters_status_name}
        marginTop={20}
        titleColor={Colors.APP_RED_SUBHEADING_COLOR}
        subtitleColor={Colors.APP_BLUE_HEADING_COLOR}
      />
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_BLUE_HEADING_COLOR}
        value={status_description}
      />

      {details.Sukh_Tax_Reply && (
        <Heading
          fontSize={17}
          marginTop={12}
          fontWeight="700"
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={'SUKH TAX REPLY'}
        />
      )}

      {details.Sukh_Tax_Reply &&
        details.Sukh_Tax_Reply.map((item, index) => {
          return (
            <Heading
              key={item.reply}
              fontSize={18}
              marginTop={12}
              fontWeight="700"
              color={Colors.APP_BLUE_HEADING_COLOR}
              value={item.reply}
            />
          );
        })}

      {details.Attachments && (
        <Heading
          fontSize={17}
          marginTop={12}
          fontWeight="700"
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={'ATTACHMENTS'}
        />
      )}
      {details?.Attachments?.map((item, index) => {
        return (
          <FileCard
            key={item.document_title}
            item={item}
            isLoadingiOS={isLoadingiOS}
            downloadingItem={downloadingItem}
            onClick={() => {
              if (item.document_file_name) {
                handleFileDownloading(item, () => {
                  console.log('groupedDocs1111', item);
                });
              }
            }}
          />
        );
      })}

      <SKButton
        marginTop={56}
        fontSize={16}
        width="50%"
        fontWeight="normal"
        iconcolor={Colors.WHITE}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'CRA HOME'}
        onPress={() => {
          navigation.navigate('CRALanding');
        }}
      />
    </View>
  );
};
const KeyValueView = props => {
  const {
    marginTop = 0,
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
      }}>
      <Text
        style={{fontWeight: '700', fontSize: 20, color: titleColor, flex: 1.5}}>
        {props.title}
      </Text>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 20,
          color: subtitleColor,
          flex: 1,
        }}>
        {props.value}
      </Text>
    </View>
  );
};

const FileCard = props => {
  const {item, onClick, isLoadingiOS = false, downloadingItem} = props;
  const {document_title, cra_letters_document_id} = item;
  const isSame =
    downloadingItem?.cra_letters_document_id == cra_letters_document_id;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
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
        {document_title}
      </Text>
      {isLoadingiOS && isSame ? (
        <Lottie style={{width: 25, height: 25}} autoPlay loop source={loader} />
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

export default CRALattersStatus;
