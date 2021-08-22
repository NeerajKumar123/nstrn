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
import {ImageQualityOptions} from '../constants/StaticValues'

const Identification = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false)

  const intiateImageUploading = (res) =>{
    const imgObj = res?.assets?.[0]
    if (!imgObj.base64) Alert.alert('SukhTax','Something went wrong!')
    setIsLoading(true)
    const params = prepareParams(imgObj.base64)
    uploadImage(params,(uploadRes) =>{
      setIsLoading(false)
      uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message)
      setIsUploadedSuccessfully(uploadRes?.status == 1 ? true : false)
    })
  }


  const prepareParams = (bs64Image) =>{
    const year = global?.selectedYears?.[0]
    const {user_id,tax_file_id} = global.onlineStatusData
    const params = {User_id:user_id,Tax_File_Id:tax_file_id,Year:year,FileNameWithExtension:'identification-document.jpg',Base64String:bs64Image}
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
        <UploadDocButton  marginTop = {35} title = 'UPLOAD THE DOC HERE' height ={46}
        onClick={() => {
          launchImageLibrary(ImageQualityOptions, res => {
            if (res?.didCancel) {
              Alert.alert('SukhTax', 'Image uploading cancelled by user.')
            }else if (res?.error) {
              console.log('error', res?.error ?? ERROR_MSG);
            }else if(res?.assets){
              intiateImageUploading(res)
            }
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
            navigation.navigate('BasicInfo');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Identification;
