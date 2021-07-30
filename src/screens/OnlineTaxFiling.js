import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image,Alert} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import {uploadImage} from '../apihelper/Api'
import SKButton, {UploadDocButton} from '../components/SKButton'; 

const OnlineTaxFiling = props => {
  const [status, setStatus] = useState(1);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)

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
    uploadImage(params,(uploadRes) =>{
      setIsLoading(false)
      uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message)
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
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="ONLINE TAX FILING" marginTop={124} />
        <TaxFilingStatusCard
          status={status}
          marginTop={25}
          title="2018 TAX RETURN"
          uploadClick={() => {
            console.log('onClicked');
            launchImageLibrary(options, res => {
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
          }}
        />
        <MessegesView
          onClick={() => {
            navigation.navigate('Messages');
          }}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'EDIT INFO'}
            onPress={() => {
            }}
          />
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'Continue'}
            onPress={() => {
              navigation.navigate('PaymentAwaiting');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const TaxFilingStatusCard = props => {
  const {status,uploadClick} = props;
  console.log('global.fileStatusRes',global.fileStatusRes)
  const data = global.fileStatusRes && global.fileStatusRes.data && global.fileStatusRes.data.length > 0  ? global.fileStatusRes?.data[0] : undefined
  let statusText = '',descText = ''
  if(data){
     statusText = data.tax_file_status_name
     descText = data.status_description  
  }
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: props.marginTop,
      }}>
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="STATUS OF FILE :"
      />
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.APP_BLUE_HEADING_COLOR}
        value={statusText}
        marginTop={2}
      />
      <Text
        style={{
          textAlign: 'left',
          color: Colors.BLACK,
          fontSize: 17,
          width: '100%',
          fontWeight: '400',
          marginTop: 30,
        }}>
        {descText}
      </Text>
      {status == 1 && 
      <UploadDocButton 
      marginTop = {35} title = 'UPLOAD THE MISSING DOC HERE' height ={46} 
      onClick = {()=>{
        uploadClick()
      }}
      />}
    </View>
  );
};

const MessegesView = props => {
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.APP_RED_SUBHEADING_COLOR, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 90,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClick && props.onClick();
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            MESSAGES :
          </Text>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            2 NEW MESSAGES
          </Text>
        </View>
        <Image
          resizeMode="contain"
          style={{
            width: 42,
            height: 38,
          }}
          source={CustomFonts.messeges}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OnlineTaxFiling;
