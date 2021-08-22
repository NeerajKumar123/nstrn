import React ,{useState} from  'react';
import {TouchableOpacity, View, Text, ScrollView, Image, Alert} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton, {UploadDocButton} from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {craLattersSaveNewLetter} from '../apihelper/Api'
import * as CustomFonts from '../constants/FontsDefs'
import SKLoader from '../components/SKLoader';
import {ImageQualityOptions} from '../constants/StaticValues'
import SKInput from '../components/SKInput';
import {ST_REGEX} from '../constants/StaticValues'
import * as Validator from '../helpers/SKTValidator'

const NewCRALatter = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false)
  const [title, setTitle] = useState('Title')
  const [desc, setDesc] = useState('Desc')
  let attachments = []


  const prepareParams = () =>{
    const {user_id,cra_letters_id} = global.craLattersData
    const base64s = attachments.join()
    console.log('base64s',base64s)
    const params = {User_id:user_id,Title:title ,Description:desc,CRA_Letters_Id:cra_letters_id,FileNameWithExtension:'cra-document.jpg',Base64String:base64s}
    return params
  }

  const checkFormValidations = () => {
    const isTitleValid =  Validator.isValidField(title, ST_REGEX.Address)
    const isDescValid =  Validator.isValidField(desc, ST_REGEX.Address)

    let isValidForm = true;
    if (!isTitleValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid title.' );
    }else if (!isDescValid) {
      isValidForm = false;
      Alert.alert('SukhTax','Please enter valid desciption.' );
    }else if (attachments.length < 1) {
      isValidForm = false;
      Alert.alert('SukhTax','Please attach document for CRA Letter.' );
    }
    return isValidForm;
  };

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
        <UploadDocButton  marginTop = {35} title = 'UPLOAD THE CRA LETTER' height ={46}
        onClick={() => {
          console.log('ImageQualityOptions',JSON.stringify(ImageQualityOptions))
          launchImageLibrary(ImageQualityOptions, res => {
            console.log('res',res)
            if (res?.didCancel) {
              Alert.alert('SukhTax', 'Image uploading cancelled by user.')
            }else if (res?.error) {
              console.log('error', res?.error ?? ERROR_MSG);
            }else if(res?.assets){
              const isMultiple = res?.assets?.length > 1
              res?.assets?.forEach(element => {
                console.log('res?.assets',res?.assets)
                attachments.push(element.base64)
              });
            }
          });
        }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'SUBMIT'}
          onPress={() => {
            if(checkFormValidations()){
              const params = prepareParams()
              setIsLoading(true)
              craLattersSaveNewLetter(params,(saveRes)=>{
                setIsLoading(false)
                if (saveRes?.status == 1) {
                  navigation.navigate('CRALattersStatus');
                }else{
                  const msg = saveRes?.message ?? 'Something went wront, Please try again later.'
                  Alert.alert('SukhTax',msg)
                }
              })
            }
          }}
        />
      </ScrollView>
    </View>
  );
};

export default NewCRALatter;
