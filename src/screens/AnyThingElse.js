import React,{useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
import * as CustomFonts from '../constants/FontsDefs'
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {saveMessage} from '../apihelper/Api';

const AnyThingElse = props => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [anythingText, setAnythingText] = useState(undefined)
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height:'100%',
      }}>
      <AppHeader navigation = {navigation}/>
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%', marginBottom:100}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom:10
        }}>
        <Heading value="ANYTHING ELSE" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="PLEASE USE THE BELOW BOX TO TELL US ABOUT ANYTHING REGARDIING YOUR TAX YEAR, OR ABOUT ANYTHING YOU WOULD LIKE US TO KNOW."
        />
        <SKInput
          marginTop={20}
          marginBottom={0}
          maxLength = {100}
          borderColor={Colors.CLR_0065FF}
          value={''}
          placeholder = 'Please type here.'
          onEndEditing={value => {
            setAnythingText(value)
          }}
        />
        <SKButton
          marginTop = {30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'FINISH'}
          onPress={() => {
            console.log('link pressed');
            setIsLoading(true);
            const userid = global.userInfo?.user_id;
            const taxFileID = global.userInfo?.Tax_File_Id;      
            const params = {
              User_Id: userid,
              Tax_File_Id: taxFileID || 83,
              Message: anythingText,
            };
            saveMessage(params, saveMsgRes => {
              console.log('saveMsgRes', saveMsgRes)
              setIsLoading(false);
              navigation.navigate('OnlineAllDone');
            });
          }}
        />
      </ScrollView>
    </View>
  );
};



export default AnyThingElse;
