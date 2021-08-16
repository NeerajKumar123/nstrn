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
import SKInput from '../components/SKInput';

const NewCRALatter = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false)
  const [title, setTitle] = useState()
  const [desc, setDesc] = useState()

  const intiateImageUploading = (res) =>{
    setIsLoading(true)
    const imgObj = res?.assets?.[0]
    if (!imgObj.base64) Alert.alert('SukhTax','Something went wrong!')
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
          value="NEW LETTER"
          marginTop={30}
        />
         <SKInput
          marginBottom={2}
          marginTop = {30}
          maxLength = {16}
          borderColor={Colors.CLR_0065FF}
          value={title}
          placeholder = 'Enter title'
          onEndEditing={value => {
            setTitle(value)
          }}
        />
        <SKInput
          marginBottom={2}
          marginTop = {30}
          maxLength = {16}
          borderColor={Colors.CLR_0065FF}
          value={desc}
          placeholder = 'Enter description'
          onEndEditing={value => {
            setDesc(value)
          }}
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
        //   disable = {!isUploadedSuccessfully}
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'SUBMIT'}
          onPress={() => {
            navigation.navigate('CRALattersStatus');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default NewCRALatter;
