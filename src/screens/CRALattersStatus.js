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
} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton, {DarkBlueButton} from '../components/SKButton';
import {craLattersGetDetails} from '../apihelper/Api';
import {downloadFileFromUrl} from '../helpers/BaseUtility';
import Lottie from 'lottie-react-native';
const loader = require('../../assets/loader.json');

const CRALattersStatus = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [status, setStatus] = useState(1);
  const [details, setDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
        titleColor={Colors.APP_BLUE_HEADING_COLOR}
        subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
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
        titleColor={Colors.APP_BLUE_HEADING_COLOR}
        subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
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
        style={{fontWeight: '700', fontSize: 20, color: titleColor, flex: 2}}>
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
