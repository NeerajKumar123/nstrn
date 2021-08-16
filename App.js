/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import AuthNavigator from './src/AuthNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';
import {stripekey_test} from './src/constants/StaticValues'

const App = () => {
  return (
    <>
    <StripeProvider publishableKey={stripekey_test}>
      <AuthNavigator/> 
    </StripeProvider>
    </>
  );
};
export default App;


//react-native run-android --no-packager --variant=release