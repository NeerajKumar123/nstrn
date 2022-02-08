import React, {useState, useEffect} from 'react';
import SKStack, {AuthStack} from  './SKStack';
import {DeviceEventEmitter} from 'react-native';
import * as SKTStorage from './helpers/SKTStorage'

export default function AuthNavigator() {

  const [isReady, setIsReady] = useState(false)
  SKTStorage.getUserData((res) =>{
    setIsLoggedIn(res && res.user_id  && res.email ? true : false )
    setIsReady(true)
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authSubscriber = DeviceEventEmitter.addListener(
      'user_loggedin',
      (isLogged) => {
        if(isLogged){
          setIsLoggedIn(true)
        }else{
          SKTStorage.clearAllData(()=>{
            setIsLoggedIn(false)
          })
        }
      },
    );
    // unsubscribe on unmount
    return authSubscriber;
  }, []);
  return !isReady ? null : !isLoggedIn ? <AuthStack/> : <SKStack/> ;
}
