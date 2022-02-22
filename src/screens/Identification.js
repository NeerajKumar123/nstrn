import React, {useState, useRef} from 'react';
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
import {uploadImage} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import SKLoader from '../components/SKLoader';
import {
  LibImageQualityOptions,
  ImageActionSheetOptions,
} from '../constants/StaticValues';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

const Identification = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false);
  const [uploadImageCount, setUploadImageCount] = useState(0);
  const actionSheetRef = useRef();

  const intiateImageUploading = (res, isDoc) => {
    if (isDoc) {
      let path =
        Platform.OS == 'ios' ? res.uri.replace('file://', '') : res.uri;
      const filename = res?.name;
      RNFetchBlob.fs
        .readFile(path, 'base64')
        .then(encoded => {
          const params = prepareParams(encoded, filename);
          setIsLoading(true);
          uploadImage(params, uploadRes => {
            setIsUploadedSuccessfully(uploadRes?.status == 1 ? true : false);
            uploadRes?.status == 1 && setUploadImageCount(uploadImageCount + 1);
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
          });
        })
        .catch(error => console.error(error));
    } else {
      const imgObj = res?.assets?.[0];
      if (!imgObj.base64) Alert.alert('SukhTax', 'Something went wrong!');
      const params = prepareParams(imgObj.base64, imgObj?.fileName);
      setIsLoading(true);
      uploadImage(params, uploadRes => {
        setIsUploadedSuccessfully(uploadRes?.status == 1 ? true : false);
        uploadRes?.status == 1 && setUploadImageCount(uploadImageCount + 1);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
    }
  };

  const prepareParams = (bs64Image, fileNameAndfileType) => {
    const year = global?.selectedYears?.[0] || 2020;
    const {user_id, tax_file_id} = global.onlineStatusData;
    const params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id,
      Year: year,
      FileNameWithExtension: fileNameAndfileType,
      Base64String: bs64Image,
    };
    return params;
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
        }}>
        <Heading
          fontSize={23}
          value="UPLOAD YOUR IDENTIFICATION"
          marginTop={30}
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE NEED TO VERIFY THAT IT'S REALLY YOU!"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="PLEASE UPLOAD ONE OF THE FOLLOWING:"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="- DRIVING LICENCE"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="- PASSPORT"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="- PROVINCIAL ID CARD"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="- CITIZENSHIP CARD"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="- PR CARD"
        />
        <UploadDocButton
          marginTop={35}
          title="UPLOAD THE DOC HERE"
          height={46}
          onClick={() => {
            actionSheetRef.current.show();
          }}
        />
        {uploadImageCount ? (
          <UploadedFilesStatus count={uploadImageCount} />
        ) : null}
        <SKButton
          disable={!isUploadedSuccessfully}
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BASIC INFO'}
          onPress={() => {
            navigation.navigate('BasicInfo');
          }}
        />
        <ActionSheet
          ref={actionSheetRef}
          title={
            <Text style={{color: Colors.GRAY, fontSize: 18}}>
              Which one do you like?
            </Text>
          }
          options={ImageActionSheetOptions}
          onPress={index => {
            setTimeout(() => {
              if (index == 0) {
                launchImageLibrary(LibImageQualityOptions, res => {
                  if (res?.didCancel) {
                    Alert.alert(
                      'SukhTax',
                      'Image uploading cancelled by user.',
                    );
                  } else if (res?.error) {
                  } else if (res?.assets) {
                    console.log('res',res)
                    intiateImageUploading(res, false);
                  }
                });
              } else if (index == 1) {
                launchCamera(LibImageQualityOptions, res => {
                  if (res?.didCancel) {
                    Alert.alert(
                      'SukhTax',
                      'Image uploading cancelled by user.',
                    );
                  } else if (res?.error) {
                  } else if (res?.assets) {
                    intiateImageUploading(res, false);
                  }
                });
              } else if (index == 2) {
                setTimeout(
                  () => {
                    DocumentPicker.pick({
                      type: [DocumentPicker.types.pdf],
                    })
                      .then(res => {
                        const fileRes = res[0];
                        intiateImageUploading(fileRes, true);
                      })
                      .catch(err => {
                        console.log('err', err);
                      });
                  },
                  Platform.OS === 'ios' ? 300 : 0,
                );
              }
            }, 100);
          }}
        />
      </ScrollView>
    </View>
  );
};

const UploadedFilesStatus = props => {
  const {count} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        marginTop: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
      }}
      onPress={() => {
        props.onClicked && props.onClicked();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          fontFamily: CustomFonts.OpenSansRegular,
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 15,
        }}>
        {` Uploaded Documents : ${count}`}
      </Text>
    </TouchableOpacity>
  );
};

export default Identification;
