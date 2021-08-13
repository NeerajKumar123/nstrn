import React , {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image, Alert} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {getTaxReturnsDocs, getIncorporationDocs, getT1GeneralDocs, getCRALattersDocs} from '../apihelper/Api';
const AllDocuments = props => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation = {navigation}/>
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="DOCUMENTS" marginTop={122} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WHICH DOCUMENTS WOULD 
          YOU LIKE TO SEE"
        />
        <DocOptionCard
          grads={[Colors.APP_RED_SUBHEADING_COLOR, Colors.CLR_D72528]}
          title="TAX RETURNS"
          onClicked = {()=>{
            setIsLoading(true)
            const {user_id} = global.onlineStatusData
            const params = {User_Id:user_id}
            getTaxReturnsDocs(params,(taxReturnDocsRes) =>{
              setIsLoading(false)
              if(taxReturnDocsRes?.data?.length){
                navigation.navigate('HomeDocsListing',{page_id:1,page_title:'TAX RETURNS', docs:taxReturnDocsRes?.data})
              }else{
                Alert.alert('Sukhtax','There is no document.')
              }
            })
          }}
        />
        <DocOptionCard
          grads={[Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR]}
          title="INCORPORATION DOCS"
          onClicked = {()=>{
            setIsLoading(true)
            const {user_id} = global.onlineStatusData
            const params = {User_Id:user_id}
            getIncorporationDocs(params, (incorpDocsRes) =>{
              setIsLoading(false)
              if(incorpDocsRes?.data?.length){
                navigation.navigate('HomeDocsListing',{page_id:2,page_title:'INCORPORATION DOCS',docs:incorpDocsRes?.data})
              }else{
                Alert.alert('Sukhtax','There is no document.')
              }
            })        
          }}
        />
        <DocOptionCard
          grads={[Colors.APP_RED_SUBHEADING_COLOR, Colors.CLR_D72528]}
          title="T1 GENERAL NOA T-SLIPS"
          onClicked = {()=>{
            setIsLoading(true)
            const {user_id} = global.onlineStatusData
            const params = {user_id}
            getT1GeneralDocs(params, (t1GRes)=>{
              setIsLoading(false)
              if(t1GRes?.data?.length){
                navigation.navigate('HomeDocsListing',{page_id:3,page_title:'T1 GENERAL, NOA, T-SLIPS',docs:t1GRes?.data})
              }else{
                Alert.alert('Sukhtax','There is no document.')
              }
            })        
          }}
        />
        <DocOptionCard
          grads={[Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR]}
          title="CRA LETTERS DOCS"
          onClicked = {()=>{
            setIsLoading(true)
            const {user_id} = global.onlineStatusData
            const params = {User_Id:user_id}
            getCRALattersDocs(params, (craDocsRes)=>{
              setIsLoading(false)
              if(craDocsRes?.data?.length){
                navigation.navigate('HomeDocsListing',{page_id:4, page_title:'CRA LETTERS DOCS',docs:craDocsRes?.data})
              }else{
                Alert.alert('Sukhtax','There is no document.')
              }
            })
          }}
        />
      </ScrollView>
    </View>
  );
};

const DocOptionCard = props => {
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
        height: 64,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'left',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '700',
            marginTop: 5,
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default AllDocuments;
