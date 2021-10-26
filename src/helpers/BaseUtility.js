import * as React from 'react';
import {Alert} from 'react-native';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import * as SKTStorage from '../helpers/SKTStorage';
import {
  getActiveFileStatusOnLogin,
  incorpGetIncorpStatus,
  taxDocsGetTaxDocsStatus,
  craLattersGetStatus
} from '../apihelper/Api';


export const rpLoaderRef = React.createRef();

export const showToast = msg => {
  Alert.alert('Root', msg);
};

const showLoader = () => {
  rpLoaderRef?.current?.show();
};

const hideLoader = () => {
  rpLoaderRef?.current?.hide();
};

export const areEqualDates = (first, second) => {
  const isSameYears = first.getFullYear() == second.getFullYear();
  const isSameMonth = first.getMonth() == second.getMonth();
  const isSameDay = first.getDate() == second.getDate();
  return isSameYears && isSameMonth && isSameDay;
};

export const getDateFromstring = dateString => {
  var dateString = dateString; // Oct 23
  var dateMomentObject = moment(dateString, 'DD-MM-YYYY'); // 1st argument - string, 2nd argument - format
  var dateObject = dateMomentObject.toDate(); // convert moment.js object to Date object
  return dateObject;
};

export const isEmpty = value => {
  return typeof value === 'undefined' || value === null || value.length == 0;
};

export async function downloadFileFromUrl(url, filename, callback) {
  if (Platform.OS === 'android') {
    const granted = await checkPermission(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!granted) {
      return;
    }
  }

  const {dirs} = RNFetchBlob.fs;
  let pathToSave = '';
  if (Platform.OS === 'android') {
    pathToSave = `${dirs.SDCardDir}/SKT/${filename}`;
  } else {
    pathToSave = `${dirs.DocumentDir}/${filename}`;
  }
  pathToSave = pathToSave.replace(' ', '');
  let fileType,
    filePath = '';

  RNFetchBlob.fs
    .exists(pathToSave)
    .then(exist => {
      RNFetchBlob.config({
        path: pathToSave,
      })
        .fetch('GET', `${url}`, {})
        .then(res => {
          filePath = res.path();
          fileType =
            res.respInfo.headers['content-type'] ||
            res.respInfo.headers['Content-Type'];
          if (!fileType) {
            fileType = 'application/pdf';
          }

          if (!filePath) {
            Alert.alert('SukhTax', 'No internet connection!');
            return;
          }
          Alert.alert('SukhTax', 'Download completed');
          callback(pathToSave)

          // if (Platform.OS === 'ios') {
          //   RNFetchBlob.ios.openDocument(pathToSave)
          //   .catch((errorMessage, statusCode) => {
          //     Alert.alert('SukhTax', 'Something went wrong!');
          //   });;
          // } else {
          //   RNFetchBlob.android.actionViewIntent(filePath, fileType);
          //   RNFetchBlob.android
          //     .addCompleteDownload({
          //       title: filename,
          //       description: 'Download Complete',
          //       path: filePath,
          //       mime: fileType,
          //       showNotification: true,
          //     })
          //     .then(() =>
          //       RNFetchBlob.fs.scanFile([{path: filePath, mime: fileType}]),
          //     );
          // }
        })
        .catch((errorMessage, statusCode) => {
          Alert.alert('SukhTax', errorMessage, statusCode);
        });
    })
    .catch(error => {});
}

const updateSelectionData = (res) =>{
  const allYearsData = res?.data
  const allFiledYearsData =  allYearsData?.filter(element => element?.tax_file_status_id == 16);

  let lastSelectedYearsString =  ''
  allFiledYearsData?.map((element) =>{
    lastSelectedYearsString = lastSelectedYearsString + element?.years_selected
  })
  const years = lastSelectedYearsString.split(',')
  global.alreadyFliedYears = years
}

export const loadIntialData = (callback) => {
  const {user_id} = global.userInfo
  const params = {User_Id:user_id}
  SKTStorage.loadLastSavedData((res)=>{
    const [selectedYears,isFromSpouseFlow,province] = res
    const [keyYear, valueYear] = selectedYears
    global[keyYear] = JSON.parse(valueYear) 
    const [keySpouse, valueSpouse] = isFromSpouseFlow
    global[keySpouse] = valueSpouse 
    const [keyProvince, valueProvince] = province
    global[keyProvince] = valueProvince 
    const arr =   JSON.parse(valueYear)?.sort(function(a, b) {
      return parseInt(b) - parseInt(a);
    });
    global.mostRecentYear = arr?.[0] ?? '2020'
    if (!global.selectedYears) {
      global.selectedYears = ['2020']
    }
    getActiveFileStatusOnLogin(params, (fileStatusRes) =>{
      if(fileStatusRes?.status == 1){
        const statusData = fileStatusRes?.data && fileStatusRes?.data.length > 0 ? fileStatusRes?.data[0] : {}
        global.onlineStatusData = statusData ? statusData : {}
        updateSelectionData(fileStatusRes)
        incorpGetIncorpStatus(params,(incStatusRes) =>{
          if(incStatusRes?.status == 1){
            const incStatusData = incStatusRes?.data && incStatusRes?.data.length > 0 ? incStatusRes?.data[0] : {}
            global.incStatusData = incStatusData ? {...incStatusData,...global.userInfo} : {...global.onlineStatusData,...global.userInfos}
            taxDocsGetTaxDocsStatus(params,(taxDocsRes) =>{
              if(taxDocsRes?.status){
                const taxDocsResData = taxDocsRes?.data && taxDocsRes?.data.length > 0 ? taxDocsRes?.data[0] : {}
                global.taxDocsStatusData = taxDocsResData ? {...taxDocsResData,...global.userInfo} : {...global.taxDocsResData,...[]}  
                const {user_id} = global.userInfo;
                const params = {User_Id: user_id};
                craLattersGetStatus(params, craRes => {
                  if (craRes?.status == 1) {
                    const craLattersResData = craRes?.data && craRes?.data.length > 0 ? craRes?.data[0] : {}
                    global.craLattersData = craLattersResData
                    callback({status:1, msg:''})
                  } else {
                    const msg = craRes?.message ?? 'Something went wrong,Please try again.'
                    Alert.alert('SukhTax', msg,[{text: 'Retry',onPress: () => loadIntialData()}]);                
                    callback({status:-1, msg:msg})
                  }
                });
              }else{
                const msg = taxDocsRes?.message ?? 'Something went wrong,Please try again.'
                Alert.alert('SukhTax', msg,[{text: 'Retry',onPress: () => loadIntialData()}]);                
                callback({status:-1, msg:msg})
              }
            })
          }else{
            const msg = incStatusRes?.message ?? 'Something went wrong,Please try again.'
            Alert.alert('SukhTax', msg,[{text: 'Retry',onPress: () => loadIntialData()}]);                
            callback({status:-1, msg:msg})
          }
        })
      }else{
        const msg = fileStatusRes?.message ?? 'Something went wrong,Please try again.'
        Alert.alert('SukhTax', msg,[{text: 'Retry',onPress: () => loadIntialData()}]);                
        callback({status:-1, msg:msg})
      }
    })
  })
}

export default {
  hideLoader,
  showLoader,
  showToast,
  downloadFileFromUrl,
};
