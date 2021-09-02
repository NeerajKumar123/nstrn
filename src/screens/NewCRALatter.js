import React, {useState} from 'react';
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
import SKButton, {UploadDocButton} from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {craLattersSaveNewLetter} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import SKLoader from '../components/SKLoader';
import {ImageQualityOptionsWithMultiSelectionSupport} from '../constants/StaticValues';
import SKInput from '../components/SKInput';
import {ST_REGEX} from '../constants/StaticValues';
import * as Validator from '../helpers/SKTValidator';

const NewCRALatter = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [attachmentNames, setAttachmentNames] = useState([]);

  const prepareParams = () => {
    const {user_id} = global.userInfo;
    const base64s = attachments.join();
    const params = {
      User_id: user_id,
      Title: title,
      Description: desc,
      FileNameWithExtension: 'cra-document.jpg',
      Base64String: base64s
    };
    return params;
  };

  const checkFormValidations = () => {
    const isTitleValid = Validator.isValidField(title, ST_REGEX.Address);
    const isDescValid = Validator.isValidField(desc, ST_REGEX.Address);
    let isValidForm = true;
    if (!isTitleValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid title.');
    } else if (!isDescValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid desciption.');
    } else if (attachments.length < 1) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please attach document for CRA Letter.');
    }
    return isValidForm;
  };

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
        paddingBottom:30
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading fontSize={23} value="NEW LETTER" marginTop={30} />
        <SKInput
          marginBottom={2}
          marginTop={30}
          maxLength={16}
          borderColor={Colors.CLR_0065FF}
          value={title}
          placeholder="Enter title"
          onEndEditing={value => {
            setTitle(value);
          }}
        />
        <SKInput
          marginBottom={2}
          marginTop={30}
          maxLength={16}
          borderColor={Colors.CLR_0065FF}
          value={desc}
          placeholder="Enter description"
          onEndEditing={value => {
            setDesc(value);
          }}
        />
        {attachmentNames && attachmentNames.length > 0 && (
          <Heading
            fontSize={18}
            color={Colors.APP_BLUE_HEADING_COLOR}
            value="FILES TO BE UPLOADED"
            marginTop={30}
            marginBottom={0}
          />
        )}
        {attachmentNames &&
          attachmentNames.map((item, index) => {
            return <FileCard key={item} item={item}
            onDeleteClicked = {()=>{
            }}
             />;
          })}
          <UploadDocButton
          isAttach = {true}
          marginTop={35}
          title={attachments && attachments.length > 0 ? 'ATTACH MORE' : 'ATTACH CRA LETTER'}
          height={46}
          onClick={() => {
            launchImageLibrary(ImageQualityOptionsWithMultiSelectionSupport, res => {
              if (res?.didCancel) {
                Alert.alert('SukhTax', 'Image uploading cancelled by user.');
              } else if (res?.error) {
                console.log('error', res?.error ?? ERROR_MSG);
              } else if (res?.assets) {
                const isMultiple = res?.assets?.length > 1;
                let names = [];
                let attachs = [];
                res?.assets?.forEach(element => {
                  attachs.push(element.base64);
                  names.push(element.fileName);
                });
                setAttachmentNames([...attachmentNames, ...names]);
                setAttachments([...attachs,...attachments])
              }
            });
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'SUBMIT'}
          onPress={() => {
            if (checkFormValidations()) {
              const params = prepareParams();
              setIsLoading(true);
              craLattersSaveNewLetter(params, saveRes => {
                setIsLoading(false);
                if (saveRes?.status == 1) {
                  navigation.navigate('CRALattersStatus',{...saveRes.data[0]});
                } else {
                  const msg =
                    saveRes?.message ??
                    'Something went wront, Please try again later.';
                  Alert.alert('SukhTax', msg);
                }
              });
            }
          }}
        />
      </ScrollView>
    </View>
  );
};

const FileCard = props => {
  const {item} = props;
  return (
<TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      }}
      onPress={() => {
        // onClick();
      }}>
      <Text
        style={{
          textAlign: 'left',
          color: Colors.APP_BLUE_HEADING_COLOR,
          fontSize: 13,
          flex: 1,
          fontFamily: CustomFonts.OpenSansRegular,
        }}>
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default NewCRALatter;


