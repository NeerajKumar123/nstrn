import * as React from 'react';
import {Alert} from 'react-native';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';

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

export const isEmpty = (value) => {
  return typeof value === 'undefined' || value === null || value.length == 0;
};

export async function downloadFileFromUrl(url, filename) {
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
  let fileType,filePath = '';

  RNFetchBlob.fs
    .exists(pathToSave)
    .then((exist) => {
      RNFetchBlob.config({
        path: pathToSave,
      })
        .fetch('GET', `${url}`, {})
        .then((res) => {
          filePath = res.path();
          fileType =
            res.respInfo.headers['content-type'] ||
            res.respInfo.headers['Content-Type'];
          if (!fileType) {
            fileType = 'application/pdf';
          }

          if (!filePath) {
            Alert.alert('SukhTax','No internet connection!');
            return;
          }
          Alert.alert('SukhTax','Download completed');

          if (Platform.OS === 'ios') {
            RNFetchBlob.ios.openDocument(pathToSave);
          } else {
            RNFetchBlob.android.actionViewIntent(filePath, fileType);
            RNFetchBlob.android
              .addCompleteDownload({
                title: filename,
                description: 'Download Complete',
                path: filePath,
                mime: fileType,
                showNotification: true,
              })
              .then(() =>
                RNFetchBlob.fs.scanFile([{path: filePath, mime: fileType}]),
              );
          }
        })
        .catch((errorMessage, statusCode) => {
          Alert.alert('SukhTax','Something went wrong!');
        });
    })
    .catch((error) => {});
}

export default {
  hideLoader,
  showLoader,
  showToast,
  downloadFileFromUrl
};
