import React,{useState, useRef} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SKLoader from '../components/SKLoader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { uploadDocumentBS64 } from '../apihelper/Api';
import {LibImageQualityOptions,ImageActionSheetOptions} from '../constants/StaticValues'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

const OnlineDocuments = props => {
  const navigation = useNavigation();

  const data = global.selectedYears;
  const [uploadImageCount, setUploadImageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const actionSheetRef = useRef()
  const [selectedYear, setSelectedYear] = useState(2020)

  const prepareParams = (bs64Image) =>{
    const {user_id,tax_file_id} = global.onlineStatusData
    const params = {User_id:user_id,Tax_File_Id:tax_file_id,Year:parseInt(selectedYear),FileNameWithExtension:'identification-document.jpg',Base64String:bs64Image}
    return params
  }

  const intiateImageUploading = (res, yr) =>{
    const imgObj = res?.assets?.[0]
    if (!imgObj.base64) Alert.alert('SukhTax','Something went wrong!')
    setIsLoading(true)
    const params = prepareParams(imgObj.base64,yr)
    uploadDocumentBS64(params,(uploadRes) =>{
      setIsLoading(false)
      setTimeout(() => {
        uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message)
        uploadRes?.status == 1 && setUploadImageCount(uploadImageCount + 1)  
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
      {isLoading && <SKLoader/>}
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
                key = {item}
                item={item}
                onClicked={() => {
                  setSelectedYear(item)
                  actionSheetRef.current.show()
                }}
              />
            );
          })}
        <UploadedFilesStatus count={uploadImageCount} />
        <ManageDocButton
          grads={[Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR]}
          title="MANAGE DOCUMENTS"
          onClicked={() => {
            navigation.navigate('ManageDocuments', {isDocAdded:uploadImageCount});
          }}
        />
        <SKButton
          marginTop={30}
          disable = {uploadImageCount < 1}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'AUTHORIZATION'}
          onPress={() => {
            navigation.navigate('AuthorizerList');
          }}
        />
          <ActionSheet
          ref={actionSheetRef}
          title={<Text style={{color: Colors.GRAY, fontSize: 18}}>Which one do you like?</Text>}
          options={ImageActionSheetOptions}
          onPress={(index) => {
            setTimeout(() => {
              if (index == 0) {
                launchImageLibrary(LibImageQualityOptions, res => {
                if (res?.didCancel) {
                  Alert.alert('SukhTax', 'Image uploading cancelled by user.')
                }else if (res?.error) {
                }else if(res?.assets){
                  intiateImageUploading(res)
                }
              });              
                }else if (index == 1) {
                launchCamera(LibImageQualityOptions, res => {
                if (res?.didCancel) {
                  Alert.alert('SukhTax', 'Image uploading cancelled by user.')
                }else if (res?.error) {
                }else if(res?.assets){
                  intiateImageUploading(res)
                }
              });
                }
            }, 100);
          }}
        />
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
        marginTop: 15,
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
        paddingHorizontal: 16,
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
  const {count} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
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
        {` DOC UPLOADED :${count} FILE${count > 1 ? 'S' : ''}`}
      </Text>
    </TouchableOpacity>
  );
};

export default OnlineDocuments;
