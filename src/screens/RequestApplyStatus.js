import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert, Platform, Linking, TouchableOpacity, Image} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import SKButton, {DarkBlueButton} from '../components/SKButton';
import DocumentViewer from '../components/DocumentViewer';
import {
  taxDocsGetReqDocs
} from '../apihelper/Api';

const RequestApplyStatus = props => {
  const navigation = useNavigation();
  const {
    tax_docs_status_name = 'File not Submitted',
    status_description = 'Looks like you have to complete your registration and upload document still!',
    new_message_count = 0,
    tax_docs_status_id = 1,
  } = global.taxDocsStatusData;
  
  const [docs, setDocs] = useState()
  const [showDoc, setShowDoc] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  useEffect(() => {
    const {user_id, tax_docs_id,tax_docs_status_id} = global.taxDocsStatusData
    if(tax_docs_status_id == 3){
      const params = {User_Id:user_id,Tax_Docs_Id:tax_docs_id}
      taxDocsGetReqDocs(params,(docsRes) =>{
        if(docsRes?.status == 1){
          setDocs(docsRes.data)
        }else{
          const msg = docsRes?.message ??'Something went wront, Please try again later.';
        Alert.alert('SukhTax', msg);
        }
      })
    }
  }, [])

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
          paddingBottom: Platform.OS == 'ios' ? 100 : 0,
        }}>
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
            reqDocs = {docs}
            tax_docs_status_name={tax_docs_status_name}
            status_description={status_description}
            new_message_count={new_message_count}
            navigation={navigation}
            onDocClicked = {(item)=>{
              setSelectedItem(item)
              setShowDoc(true)
            }}
           onAllDownloadClicked = {()=>{
            console.log('onAllDownloadClicked')
           }} 
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
  const {
    navigation,
    tax_docs_status_name,
    status_description,
    new_message_count,
  } = props;

  const incorpMoveToPage = props => {
    navigation.navigate('RequestLanding');
  };

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
      <SKButton
        fontSize={16}
        marginTop={30}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.SECONDARY_FILL}
        borderColor={Colors.PRIMARY_BORDER}
        title={'NEW REQUEST'}
        onPress={() => {
          incorpMoveToPage();
        }}
      />
    </View>
  );
};
const AllSet = props => {
  const {navigation,tax_docs_status_name, status_description,reqDocs,onAllDownloadClicked,onDocClicked} = props;
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
      {reqDocs && reqDocs.map((item, index) => {
          return (
            <FileCard
              key = {item.document_title}
              item={item}
              onClick={() => {
                onDocClicked(item);
              }}
            />
          );
        })}
      <SKButton
        marginTop={56}
        fontSize={16}
        fontWeight={'normal'}
        width="100%"
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.SECONDARY_FILL}
        title={'DOWNLOAD DOCS'}
        onPress={() => {
          navigation.navigate('AllDocuments');
        }}
      />
      <SKButton
        fontSize={16}
        marginTop={30}
        width="100%"
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
      <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'NEW REQUEST'}
          onPress={() => {
            navigation.navigate('RequestLanding')
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
const InProcess = props => {
  const {navigation,tax_docs_status_name, status_description} = props;
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
  const {item, onClick} = props;
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
        {item.document_title}
      </Text>
      <Image
        resizeMode="contain"
        style={{width: 20, height: 20, marginLeft: 10}}
        source={CustomFonts.download}
      />
    </TouchableOpacity>
  );
};

export default RequestApplyStatus;
