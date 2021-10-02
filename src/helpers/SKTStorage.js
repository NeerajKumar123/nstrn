import AsyncStorage from '@react-native-community/async-storage';
import {Alert, Platform} from 'react-native'
const setKeyValue = async (key, value, callback) => {
    let valuestring = '';
    if (typeof value === 'object') {
      valuestring = JSON.stringify(value);
    } else if (typeof value === 'string' || value instanceof String) {
      valuestring = value;
    } else {
      valuestring = '' + value;
    }
    global[key] = value
    try {
      await AsyncStorage.setItem(key, valuestring)
      callback && callback()
    } catch (e) {
      // Alert.alert('Failed to save the data to the storage')
      console.log('Failed to save the data to the storage')
      callback && callback()
    }
  }

  
  const setMultiKeysValues = async (obj, callback) => {
    var keys = Object.keys(obj);
    var data = []
    keys?.map((key)=>{
      const value = obj[key]
      global[key] = value
      let valuestring = '';
    if (typeof value === 'object') {
      if (value instanceof Date) {
        valuestring = '' + new Date(value).getTime();
      }else{
        valuestring = JSON.stringify(value);
      }
    } else if (typeof value === 'string' || value instanceof String) {
      valuestring = value;
    } else {
      valuestring = '' + value;
    }
      const ar = [key,valuestring]
      data.push(ar)
    })
    try {
      await AsyncStorage.multiSet(data);
      callback && callback()
    } catch (e) {
      // Alert.alert('Failed to save the data to the storage')
      console.log('Failed to save the data to the storage')
      callback && callback()
    }
  }


  const storeUserData = async (userData, callback) => {
    try {
      const savedData = await AsyncStorage.getItem('USER_DATA');
      const finalUserData = Object.assign({}, savedData, userData);
      global.userInfo = finalUserData
      await setKeyValue('USER_DATA', userData, callback);
    } catch (error) {
        console.log(error);
        callback && callback(error)
    }
  };

  const getUserData = async (callback) => {
    try {
      const userInfo = await AsyncStorage.getItem('USER_DATA');
      global.userInfo = userInfo && JSON.parse(userInfo)
      callback && callback(userInfo && JSON.parse(userInfo))
        } catch (error) {
        console.log(error);
    }
  };

  const getValue = async (key,callback) => {
    try {
      const value = await AsyncStorage.getItem(key);
      callback && callback(JSON.parse(value))
        } catch (error) {
        console.log(error);
    }
  };

  const loadLastSavedData = async (callback)=>{
    try {
      const values = await AsyncStorage.multiGet(['selectedYears','isFromSpouseFlow', 'province']);
      callback && callback(values)
        } catch (error) {
        console.log(error);
    }
  }

  const clearAllData = async (callback) => {
    try {
      global.userInfo = undefined
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      if (asyncStorageKeys.length > 0) {
        if (Platform.OS === 'android') {
          await AsyncStorage.clear();
        }
        if (Platform.OS === 'ios') {
          await AsyncStorage.multiRemove(asyncStorageKeys);
        }
      }
     callback && callback()
    } catch (error) {
        console.log(error);
    }
  };


  export {
    setKeyValue,
    setMultiKeysValues,
    getValue,
    clearAllData,
    getUserData,
    storeUserData,
    loadLastSavedData
  }