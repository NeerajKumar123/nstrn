import React, {useState, useRef, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Alert,
  PermissionsAndroid
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SKLoader from '../components/SKLoader';
import {SKModelImageTitle} from '../components/SKModel';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadDocumentBS64, getUserDocuments} from '../apihelper/Api';
import {
  LibImageQualityOptions,
  ImageActionSheetOptions,
} from '../constants/StaticValues';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

const OnlineDocumentUploadV3 = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const {statusDetails} = pageParams;
  const data = statusDetails?.years_selected?.split(',');
  const [uploadImageCount, setUploadImageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const actionSheetRef = useRef();
  const [selectedYear, setSelectedYear] = useState(2020);
  const [imageToBeUpload, setImageToBeUpload] = useState(undefined);
  const [imageName, setImageName] = useState(undefined);
  const [isImageTitleVisible, setIsImageTitleVisible] = useState(false);
  const [imageTitle, setImageTitle] = useState('');
  const [docs, setDocs] = useState();
  const isFocused = useIsFocused();

  const prepareParams = (bs64Image, title) => {
    const {user_id, tax_file_id} = statusDetails;
    const dashedTitle = title.replace(/ /g, '-');
    const isPdf = title.includes('.pdf');
    const params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id,
      Year: parseInt(selectedYear),
      FileNameWithExtension: isPdf
        ? `${dashedTitle}.pdf`
        : `${dashedTitle}.jpg`,
      Base64String: bs64Image,
    };
    return params;
  };

  useEffect(() => {
    if (isFocused) {
      getDocs();
    }
  }, [isFocused, uploadImageCount]);

  const getDocs = () => {
    setIsLoading(true)
    const {tax_file_id, user_id} = statusDetails;
    const params = {User_Id: user_id, Tax_File_Id: tax_file_id};
    getUserDocuments(params, docsRes => {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
      if (docsRes?.status == 1) {
        setDocs(docsRes.data);
      } else {
        Alert.alert('SukhTax', 'Something went wrong.');
      }
    });
  };

  const saveImageDataAndShowTitleField = res => {
    const imgObj = res?.assets?.[0];
    if (imgObj.base64) {
      setImageToBeUpload(imgObj.base64);
      setImageName('jpg');
      setIsImageTitleVisible(true);
    } else {
      Alert.alert('SukhTax', 'Something went wrong!');
    }
  };

  const saveDocumentDataAndShowTitleField = res => {
    setImageToBeUpload(res);
    setImageName('pdf');
    setIsImageTitleVisible(true);
  };
  const intiateImageUploading = title => {
    setIsLoading(true);
    const params = prepareParams(imageToBeUpload, title);
    uploadDocumentBS64(params, uploadRes => {
      uploadRes?.status == 1 && setUploadImageCount(uploadImageCount + 1);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });
  };

  async function askCamPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Sukhtax',
          'message': 'Please allow us to access camera.',
          buttonPositive: 'OK',
  
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera(LibImageQualityOptions, res => {
          if (res?.didCancel) {
            Alert.alert(
              'SukhTax',
              'Image uploading cancelled by user.',
            );
          } else if (res?.error) {
          } else if (res?.assets) {
            saveImageDataAndShowTitleField(res);
          }
        });
      } else if (PermissionsAndroid.RESULTS.DENIED){
        Alert.alert("Sukhtax", "Camera perimission not granted!")
      }
    } catch (err) {
      Alert.alert("Sukhtax", "Something went wrong!")
    }
  }

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}>
      <AppHeader
        navigation={navigation}
        onLeftClicked={() => {
          pageParams?.onDataFormUpdates(statusDetails);
          navigation.goBack();
        }}
      />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="DOCUMENTS" marginTop={122} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="THIS IS WHERE YOU CAN MANAGE ALL DOCUMENTS UPLOADED TO SUKHTAX:"
        />
        {data &&
          data?.map((item, index) => {
            return (
              <DocCard
                key={item}
                item={item}
                onClicked={() => {
                  setSelectedYear(item);
                  actionSheetRef.current.show();
                }}
              />
            );
          })}
        <UploadedFilesStatus count={docs?.length} />
        <ManageDocButton
          grads={[Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR]}
          title={'MANAGE DOCUMENTS'}
          onClicked={() => {
            navigation.navigate('ManageDocumentsV3', {
              isDocAdded: false,
              showFooterBtn: false,
              ...statusDetails
            });
          }}
        />
        <SKButton
          marginTop={30}
          disable={docs?.length > 0 ? false : true}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'SUBMIT'}
          onPress={() => {
            pageParams?.onDataFormUpdates(statusDetails);
            navigation.goBack();
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
                    saveImageDataAndShowTitleField(res);
                  }
                });
              } else if (index == 1) {
                askCamPermission()
              } else if (index == 2) {
                setTimeout(
                  () => {
                    DocumentPicker.pick({
                      type: [DocumentPicker.types.pdf],
                    })
                      .then(res => {
                        const fileRes = res[0];
                        let path =
                          Platform.OS == 'ios'
                            ? fileRes.uri.replace('file://', '')
                            : fileRes.uri;
                        if (Platform.OS == 'ios') {
                          path = path.replace(/%20/g, ' ');
                        }
                        RNFetchBlob.fs
                          .readFile(path, 'base64')
                          .then(encoded => {
                            saveDocumentDataAndShowTitleField(encoded);
                          })
                          .catch(error => console.error(error));
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
        {isImageTitleVisible && (
          <SKModelImageTitle
            title="Select"
            onClose={() => {
              setIsImageTitleVisible(false);
            }}
            onTitleEntered={value => {
              setIsImageTitleVisible(false);
              setImageTitle(`${value}.${imageName}`);
              intiateImageUploading(`${value}.${imageName}`);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const ManageDocButton = props => {
  return (
    <LinearGradient
      opacity={0.8}
      colors={props.grads}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 56,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '700',
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const DocCard = props => {
  const {item} = props;
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
          textAlign: 'left',
          color: Colors.APP_BLUE_HEADING_COLOR,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {`${item} DOCUMENTS`}
      </Text>
      <Image
        resizeMode="contain"
        style={{width: 24, height: 24}}
        source={CustomFonts.upload}
      />
    </TouchableOpacity>
  );
};

const UploadedFilesStatus = props => {
  const {count = 0} = props;
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
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {` DOC UPLOADED : ${count ? count : 0} FILE${count > 1 ? 'S' : ''}`}
      </Text>
    </TouchableOpacity>
  );
};

export default OnlineDocumentUploadV3;
