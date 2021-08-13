import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image,Alert} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import SKButton , {UploadDocButton} from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {incorpUploadImage} from '../apihelper/Api'
import {ImageQualityOptions} from '../constants/StaticValues'

const UploadCorp = props => {
  const navigation = useNavigation();
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const intiateImageUploading = (res) =>{
    setIsLoading(true)
    const imgObj = res?.assets?.[0]
    if (!imgObj.base64) Alert.alert('SukhTax','Something went wrong!')
    const params = prepareParams(imgObj.base64)
    incorpUploadImage(params,(uploadRes) =>{
      setIsLoading(false)
      uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message)
      setIsUploadedSuccessfully(uploadRes?.status == 1 ? true : false)
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
        <UploadDocButton
        marginTop = {35}
        title = 'UPLOAD THE DOC HERE'
        height ={46}
        onClick={() => {
          console.log('onClicked');
          launchImageLibrary(ImageQualityOptions, res => {
            console.log('res',res)
            if (res?.didCancel) {
              console.log('didCancel');
            }
            if (res?.error) {
              console.log('error', res?.error ?? ERROR_MSG);
            }
            if(res?.assets){
              intiateImageUploading(res)
            }
          });
        }} />
        <SKButton
          disable = {!isUploadedSuccessfully}
          marginTop={30}
          fontSize={16}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'NEXT'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('IncorporatorsList');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default UploadCorp;
