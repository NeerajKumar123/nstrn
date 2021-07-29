import React ,{useState} from  'react';
import {TouchableOpacity, View, Text, ScrollView, Image, Alert} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton, {UploadDocButton} from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadImage} from '../apihelper/Api'
import * as CustomFonts from '../constants/FontsDefs'
import SKLoader from '../components/SKLoader';

const Identification = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false)
  const options = {
    quality: .1,
    maxWidth: 5,
    maxHeight: 5,
    includeBase64:true,
  };

  const intiateImageUploading = (res) =>{
    setIsLoading(true)
    const imgObj = res?.assets?.[0]
    if (!imgObj.base64) Alert.alert('SukhTax','Something went wrong!')
    const params = prepareParams(imgObj.base64)
    console.log('params',params)
    uploadImage(params,(uploadRes) =>{
      setIsLoading(false)
      console.log('uploadRes2222',uploadRes)
      uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message)
      setIsUploadedSuccessfully(uploadRes?.status == 1 ? true : false)
    })
  }


  const prepareParams = (bs64Image) =>{
    const userid = global.userInfo?.user_id;
    const taxFileID = global.userInfo?.Tax_File_Id;
    const params = {User_id:userid,Tax_File_Id:taxFileID || 83,Year:parseInt('2020'),FileNameWithExtension:'identification-document.jpg',Base64String:bs64Image}
    return params
  }

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
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
          value="-PROVINCIAL ID CARD"
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
        <UploadDocButton  marginTop = {35} title = 'UPLOAD THE MISSING DOC HERE' height ={46}
        onClick={() => {
          console.log('onClicked');
          launchImageLibrary(options, res => {
            console.log('res',res)
            if (res?.didCancel) {
              console.log('didCancel');
            }
            if (res?.error) {
              console.log('error', res?.error ?? ERROR_MSG);
            }
            intiateImageUploading(res)
          });
        }}
        />
        <SKButton
          disable = {!isUploadedSuccessfully}
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BASIC INFO'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('BasicInfo');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Identification;
