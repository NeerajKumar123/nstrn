import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Alert
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SKLoader from '../components/SKLoader';
import { SKModelImageTitle } from '../components/SKModel';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadDocumentBS64, getUserDocuments } from '../apihelper/Api';
import { LibImageQualityOptions, ImageActionSheetOptions } from '../constants/StaticValues'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import {useIsFocused} from '@react-navigation/native';

const OnlineDocuments = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const isEditing = pageParams?.isEditing
  const data = global.selectedYears;
  const [uploadImageCount, setUploadImageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const actionSheetRef = useRef()
  const [selectedYear, setSelectedYear] = useState(2020)
  const [imageToBeUpload, setImageToBeUpload] = useState(undefined)
  const [isImageTitleVisible, setIsImageTitleVisible] = useState(false)
  const [imageTitle, setImageTitle] = useState('')
  const [docs, setDocs] = useState();
  const isFocused = useIsFocused();

  const prepareParams = (bs64Image, title) => {
    const { user_id , tax_file_id } = global.onlineStatusData
    const dashedTitle = title.replace(/ /g, "-");
    const params = { User_id: user_id, Tax_File_Id: tax_file_id, Year: parseInt(selectedYear), FileNameWithExtension: `${dashedTitle}.jpg`, Base64String: bs64Image }
    return params
  }

  useEffect(() => {
    getDocs();
  }, [isFocused,uploadImageCount]);

  const getDocs = () => {
    const {tax_file_id,user_id} = global.onlineStatusData
    const params = {User_Id: user_id, Tax_File_Id: tax_file_id};
    getUserDocuments(params, docsRes => {
      if (docsRes?.status == 1) {
        setDocs(docsRes.data);
      } else {
        Alert.alert('SukhTax', 'Something went wrong.');
      }
    });
  };

  const saveImageDataAndShowTitleField = (res) => {
    const imgObj = res?.assets?.[0]
    if (imgObj.base64) {
      setImageToBeUpload(imgObj.base64)
      setIsImageTitleVisible(true)
    } else {
      Alert.alert('SukhTax', 'Something went wrong!')
    }
  }

  const intiateImageUploading = (title) => {
    setIsLoading(true)
    const params = prepareParams(imageToBeUpload, title)
    uploadDocumentBS64(params, (uploadRes) => {
      uploadRes?.status == 1 && setUploadImageCount(uploadImageCount + 1)
      setTimeout(() => {
        setIsLoading(false)
      }, 300);
    })
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
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{ width: '100%' }}
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
                  setSelectedYear(item)
                  actionSheetRef.current.show()
                }}
              />
            );
          })}
        <UploadedFilesStatus count={docs?.length} />
        <ManageDocButton
          grads={[Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR]}
          title={"MANAGE DOCUMENTS"}
          onClicked={() => {
            navigation.navigate('ManageDocuments', { isDocAdded: docs?.length > 0 ? true : false, showFooterBtn: true });
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
          title={isEditing ? 'SUBMIT' : 'AUTHORIZATION'}
          onPress={() => {
            if (isEditing) {
              navigation.navigate('OnlineEditInfo');
            }else{
              navigation.navigate('AuthorizerList');
            }
          }}
        />
        <ActionSheet
          ref={actionSheetRef}
          title={<Text style={{ color: Colors.GRAY, fontSize: 18 }}>Which one do you like?</Text>}
          options={ImageActionSheetOptions}
          onPress={(index) => {
            setTimeout(() => {
              if (index == 0) {
                launchImageLibrary(LibImageQualityOptions, res => {
                  if (res?.didCancel) {
                    Alert.alert('SukhTax', 'Image uploading cancelled by user.')
                  } else if (res?.error) {
                  } else if (res?.assets) {
                    saveImageDataAndShowTitleField(res)
                  }
                });
              } else if (index == 1) {
                launchCamera(LibImageQualityOptions, res => {
                  if (res?.didCancel) {
                    Alert.alert('SukhTax', 'Image uploading cancelled by user.')
                  } else if (res?.error) {
                  } else if (res?.assets) {
                    saveImageDataAndShowTitleField(res)
                  }
                });
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
              console.log('value', value)
              setIsImageTitleVisible(false);
              setImageTitle(value)
              intiateImageUploading(value)
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
  const { item } = props;
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
        style={{ width: 24, height: 24 }}
        source={CustomFonts.upload}
      />
    </TouchableOpacity>
  );
};

const UploadedFilesStatus = props => {
  const { count = 0 } = props;
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

export default OnlineDocuments;
