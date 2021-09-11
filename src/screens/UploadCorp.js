import React, {useState, useEffect, useRef} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image,Alert} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import SKButton , {UploadDocButton} from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {incorpUploadImage} from '../apihelper/Api'
import * as CustomFonts from '../constants/FontsDefs';
import {LibImageQualityOptions,ImageActionSheetOptions} from '../constants/StaticValues'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

const UploadCorp = props => {
  const navigation = useNavigation();
  const [uploadImageCount, setUploadImageCount] = useState(0)
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const actionSheetRef = useRef()
  
  const intiateImageUploading = (res) =>{
    const imgObj = res?.assets?.[0]
    if (!imgObj.base64) Alert.alert('SukhTax','Something went wrong!')
    setIsLoading(true)
    const params = prepareParams(imgObj.base64)
    incorpUploadImage(params,(uploadRes) =>{
      setIsLoading(false)
      setTimeout(() => {
        uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message)
        setIsUploadedSuccessfully(uploadRes?.status == 1 ? true : false)
        uploadRes?.status == 1 && setUploadImageCount(uploadImageCount + 1)  
      }, 100);
    })
  }

  const prepareParams = (bs64Image) =>{
    const {incorporation_id, user_id} = global.incStatusData
    const params = {User_id:user_id,Incorporation_Id:incorporation_id, FileNameWithExtension:'incorp-identification-document.jpg',Base64String:bs64Image}
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
        style={{width: '100%', flex:1}}
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
        <UploadDocButton
        marginTop = {35}
        title = 'UPLOAD THE DOC HERE'
        height ={46}
        onClick={() => {
          actionSheetRef.current.show()
        }} />
        {uploadImageCount ? <UploadedFilesStatus count={uploadImageCount} /> : null}
        <SKButton
          disable = {!isUploadedSuccessfully}
          marginTop={30}
          fontSize={16}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'NEXT'}
          onPress={() => {
            navigation.navigate('IncorporatorsList');
          }}
        />
         <ActionSheet
          ref={actionSheetRef}
          title={<Text style={{color: Colors.GRAY, fontSize: 18}}>Which one do you like?</Text>}
          options={ImageActionSheetOptions}
          cancelButtonIndex={0}
          destructiveButtonIndex={4}
          onPress={(index) => {
            setTimeout(() => {
              if (index == 1) {
                launchImageLibrary(LibImageQualityOptions, res => {
                if (res?.didCancel) {
                  Alert.alert('SukhTax', 'Image uploading cancelled by user.')
                }else if (res?.error) {
                }else if(res?.assets){
                  intiateImageUploading(res)
                }
              });              
                }else if (index == 2) {
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
          fontFamily:CustomFonts.OpenSansRegular,
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 15,
        }}>
        {` Uploaded Documents : ${count}`}
      </Text>
    </TouchableOpacity>
  );
};


export default UploadCorp;
