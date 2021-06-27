import * as React from 'react';
import {Alert} from 'react-native';
import moment from 'moment';
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

export default {
  hideLoader,
  showLoader,
  showToast
};
