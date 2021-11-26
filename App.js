/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect} from 'react';
import {LogBox, Platform} from 'react-native'
import AuthNavigator from './src/AuthNavigator';
import {StripeProvider} from '@stripe/stripe-react-native';
import {stripekey_live,stripekey_test} from './src/constants/StaticValues';
import SplashScreen from 'react-native-splash-screen'
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'VirtualizedLists should never be nested inside',
  'componentWillUpdate has been renamed',
  'componentWillReceiveProps has been renamed',
  'DatePickerIOS has been merged with DatePickerAndroid',
  'Require cycle',
  'Each child in a list should have a unique "key" prop',
]);

const App = () => {

  useEffect(() => {
    {Platform.OS == 'android' && SplashScreen.hide()}
  }, [])

  return (
    <>
      <StripeProvider publishableKey={stripekey_live}>
        <AuthNavigator />
      </StripeProvider>
    </>
  );
};
export default App;

//react-native run-android --no-packager --variant=release
//  react-native run-ios --simulator="iPhone 8"
//  react-native run-ios --simulator="iPhone 8 Plus"
//  react-native run-ios --simulator="iPhone 11"
//  react-native run-ios --simulator="iPhone 11 Pro"
//  react-native run-ios --simulator="iPhone 11 Pro Max"
//  react-native run-ios --simulator="iPhone SE (2nd generation)"
//  react-native run-ios --simulator="iPhone 12 mini"
//  react-native run-ios --simulator="iPhone 12"
//  react-native run-ios --simulator="iPhone 12 Pro"
//  react-native run-ios --simulator="iPhone 12 Pro Max"
//  react-native run-ios --simulator="iPod touch (7th generation)"
//  react-native run-ios --simulator="iPad Pro (9.7-inch)"
//  react-native run-ios --simulator="iPad Pro (11-inch) (2nd generation)"
//  react-native run-ios --simulator="iPad Pro (12.9-inch) (4th generation)"
//  react-native run-ios --simulator="iPad (8th generation)"
//  react-native run-ios --simulator="iPad Air (4th generation)"
