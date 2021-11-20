import React, {useEffect, useState } from 'react';
import {
  Platform,
  BackHandler,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as CustomFonts from '../constants/FontsDefs';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import {
  EversingSuccess,
  EversingFailed,
  onlineSaveEversignConfirmation
} from '../apihelper/Api';
import * as Colors from '../constants/ColorDefs';
const { height } = Dimensions.get('window');

const SKWebPage = (props) => {
  const navigation = useNavigation()
  const pageParams = props.route.params;
  const [pageUrl] = useState(pageParams.pageUrl);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

 const handleBackPress = () => {
    if (props.navigation) {
      props.navigation.goBack();
    }
    return true;
  }

  const onNavigationStateChange = (navState) => {
    if (navState?.url?.includes(EversingSuccess) ) {
      const pageParams = props.route.params;
      const {noOfDocs,currentIndex,dochash,doc} = pageParams
      const {user_id,tax_file_id} = global.onlineStatusData
      const params = {User_Id:user_id,Tax_File_Id:tax_file_id,Tax_File_Confirmation_Id:doc?.tax_file_confirmation_id,Document_Hash:dochash}
      onlineSaveEversignConfirmation(params, () =>{
        if(noOfDocs == currentIndex){
          navigation.navigate('Home')
        }else{
          navigation.goBack()
        }  
      })
    }else if (navState?.url?.includes(EversingFailed) ) {
      // navigation.goBack()
  }
  }
  
  return (
    <View style={{ flex: 1,backgroundColor:Colors.WHITE }}>
    <AppHeader navigation={navigation} />
      <View style={{ flex: 1 }}>
        {pageUrl&&(
          // Fixed due to webpage loading as blank after coming from payment page...
          <WebView
            source={{ uri: pageUrl}}
            scalesPageToFit={true}
            onHttpError={() => callOnError()}
            onLoadStart={() => {
              setIsLoaderVisible(true);
            }}
            onLoadEnd = {() => {
              setIsLoaderVisible(false);
            }}
            onNavigationStateChange={onNavigationStateChange}
        />
        )}
        {isLoaderVisible && (
          <ActivityIndicator
            color={Colors.APP_RED_SUBHEADING_COLOR}
            animating={true}
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: (height - 54) / 2,
            }}
            size="large"
          />
        )}
      </View>
    </View>
  );
}


export default SKWebPage