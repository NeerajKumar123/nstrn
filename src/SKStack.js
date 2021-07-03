import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import VerifyOTP from './screens/VerifyOTP';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import Documents from './screens/Documents';
import TaxReturns from './screens/TaxReturns';
import OnlineTaxFiling from './screens/OnlineTaxFiling';
import SecurityCode from './screens/SecurityCode';
import SetupNewPass from './screens/SetupNewPass';
import Instructions from './screens/Instructions';
import ForgotPassword from './screens/ForgotPassword';
import Profile from './screens/Profile'
import Messages from './screens/Messages'
import Identification from './screens/Identification'

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login', headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOTP"
          component={VerifyOTP}
          options={{ title: 'VerifyOTP', headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: 'SignUp', headerShown: false }}
        />
        <Stack.Screen
          name="SecurityCode"
          component={SecurityCode}
          options={{ title: 'SecurityCode', headerShown: false }}
        />
        <Stack.Screen
          name="SetupNewPass"
          component={SetupNewPass}
          options={{ title: 'SetupNewPass', headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ title: 'ForgotPassword', headerShown: false }}
        />
        <Stack.Screen
          name="Instructions"
          component={Instructions}
          options={{ title: 'Instructions', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const SKStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Dashboard">
          <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: 'Dashboard', headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home', headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Profile', headerShown: false }}
        />
         <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ title: 'ForgotPassword', headerShown: false }}
        />
        <Stack.Screen
          name="Documents"
          component={Documents}
          options={{ title: 'Documents', headerShown: false }}
        />
        <Stack.Screen
          name="TaxReturns"
          component={TaxReturns}
          options={{ title: 'TaxReturns', headerShown: false }}
        />
        <Stack.Screen
          name="OnlineTaxFiling"
          component={OnlineTaxFiling}
          options={{ title: 'OnlineTaxFiling', headerShown: false }}
        />
        <Stack.Screen
          name="Messages"
          component={Messages}
          options={{ title: 'Messages', headerShown: false }}
        />
        <Stack.Screen
          name="Identification"
          component={Identification}
          options={{ title: 'Identification', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SKStack;
