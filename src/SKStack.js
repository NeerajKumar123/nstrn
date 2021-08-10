import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import VerifyOTP from './screens/VerifyOTP';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import AllDocuments from './screens/AllDocuments';
import HomeDocsListing from './screens/HomeDocsListing';
import OnlineTaxFilingStatus from './screens/OnlineTaxFilingStatus';
import SecurityCode from './screens/SecurityCode';
import SetupNewPass from './screens/SetupNewPass';
import Instructions from './screens/Instructions';
import ForgotPassword from './screens/ForgotPassword';
import Profile from './screens/Profile';
import Messages from './screens/Messages';
import Identification from './screens/Identification';
import BasicInfo from './screens/BasicInfo';
import Address from './screens/Address';
import BankingAndMore from './screens/BankingAndMore';
import FamilyDetails from './screens/FamilyDetails';
import Dependents from './screens/Dependents';
import OnlineDocuments from './screens/OnlineDocuments';
import MyTaxYear from './screens/MyTaxYear';
import ManageDocuments from './screens/ManageDocuments';
import SignaturePage from './screens/SignaturePage';
import AuthorizerList from './screens/AuthorizerList';
import AnyThingElse from './screens/AnyThingElse';
import OnlineAllDone from './screens/OnlineAllDone';
import PaymentAwaiting from './screens/PaymentAwaiting';
import HomePayment from './screens/HomePayment';
import CarryForward from './screens/CarryForward';
import OnlineReturnLanding from './screens/OnlineReturnLanding';
import IncorporationLanding from './screens/IncorporationLanding';
import NumberNameCorp from './screens/NumberNameCorp';
import UploadCorp from './screens/UploadCorp';
import Incorporators from './screens/Incorporators';
import IncorpDetails from './screens/IncorpDetails';
import AboutCorp from './screens/AboutCorp';
import IncorpFinalStep from './screens/IncorpFinalStep';
import HSTRegistration from './screens/HSTRegistration';
import IncorpPayment from './screens/IncorpPayment';
import IncorpInProcess from './screens/IncorpInProcess';
import Spouse from './screens/Spouse';
import SKWebPage from './screens/SKWebPage';
import PaymentScreen from './screens/PaymentScreen';
import CRALanding from './screens/CRALanding';

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login', headerShown: false}}
        />
        <Stack.Screen
          name="VerifyOTP"
          component={VerifyOTP}
          options={{title: 'VerifyOTP', headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'SignUp', headerShown: false}}
        />
        <Stack.Screen
          name="SecurityCode"
          component={SecurityCode}
          options={{title: 'SecurityCode', headerShown: false}}
        />
        <Stack.Screen
          name="SetupNewPass"
          component={SetupNewPass}
          options={{title: 'SetupNewPass', headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{title: 'ForgotPassword', headerShown: false}}
        />
        <Stack.Screen
          name="Instructions"
          component={Instructions}
          options={{title: 'Instructions', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const SKStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{title: 'Dashboard', headerShown: false}}
        />
        <Stack.Screen
          name="SetupNewPass"
          component={SetupNewPass}
          options={{title: 'SetupNewPass', headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Home', headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{title: 'Profile', headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{title: 'ForgotPassword', headerShown: false}}
        />
        <Stack.Screen
          name="AllDocuments"
          component={AllDocuments}
          options={{title: 'AllDocuments', headerShown: false}}
        />
        <Stack.Screen
          name="HomeDocsListing"
          component={HomeDocsListing}
          options={{title: 'HomeDocsListing', headerShown: false}}
        />
        <Stack.Screen
          name="OnlineTaxFilingStatus"
          component={OnlineTaxFilingStatus}
          options={{title: 'OnlineTaxFilingStatus', headerShown: false}}
        />
        <Stack.Screen
          name="Messages"
          component={Messages}
          options={{title: 'Messages', headerShown: false}}
        />
        <Stack.Screen
          name="Identification"
          component={Identification}
          options={{title: 'Identification', headerShown: false}}
        />
        <Stack.Screen
          name="BasicInfo"
          component={BasicInfo}
          options={{title: 'BasicInfo', headerShown: false}}
        />
        <Stack.Screen
          name="Address"
          component={Address}
          options={{title: 'Address', headerShown: false}}
        />
        <Stack.Screen
          name="BankingAndMore"
          component={BankingAndMore}
          options={{title: 'BankingAndMore', headerShown: false}}
        />
        <Stack.Screen
          name="FamilyDetails"
          component={FamilyDetails}
          options={{title: 'FamilyDetails', headerShown: false}}
        />
        <Stack.Screen
          name="Dependents"
          component={Dependents}
          options={{title: 'Dependents', headerShown: false}}
        />
        <Stack.Screen
          name="OnlineDocuments"
          component={OnlineDocuments}
          options={{title: 'OnlineDocuments', headerShown: false}}
        />
        <Stack.Screen
          name="MyTaxYear"
          component={MyTaxYear}
          options={{title: 'MyTaxYear', headerShown: false}}
        />
        <Stack.Screen
          name="ManageDocuments"
          component={ManageDocuments}
          options={{title: 'ManageDocuments', headerShown: false}}
        />
        <Stack.Screen
          name="SignaturePage"
          component={SignaturePage}
          options={{title: 'SignaturePage', headerShown: false}}
        />
        <Stack.Screen
          name="AuthorizerList"
          component={AuthorizerList}
          options={{title: 'AuthorizerList', headerShown: false}}
        />
        <Stack.Screen
          name="AnyThingElse"
          component={AnyThingElse}
          options={{title: 'AnyThingElse', headerShown: false}}
        />
        <Stack.Screen
          name="OnlineAllDone"
          component={OnlineAllDone}
          options={{title: 'OnlineAllDone', headerShown: false}}
        />
        <Stack.Screen
          name="PaymentAwaiting"
          component={PaymentAwaiting}
          options={{title: 'PaymentAwaiting', headerShown: false}}
        />
        <Stack.Screen
          name="HomePayment"
          component={HomePayment}
          options={{title: 'HomePayment', headerShown: false}}
        />
        <Stack.Screen
          name="CarryForward"
          component={CarryForward}
          options={{title: 'CarryForward', headerShown: false}}
        />
        <Stack.Screen
          name="OnlineReturnLanding"
          component={OnlineReturnLanding}
          options={{title: 'OnlineReturnLanding', headerShown: false}}
        />
        <Stack.Screen
          name="IncorporationLanding"
          component={IncorporationLanding}
          options={{title: 'IncorporationLanding', headerShown: false}}
        />
        <Stack.Screen
          name="NumberNameCorp"
          component={NumberNameCorp}
          options={{title: 'NumberNameCorp', headerShown: false}}
        />
        <Stack.Screen
          name="UploadCorp"
          component={UploadCorp}
          options={{title: 'UploadCorp', headerShown: false}}
        />
        <Stack.Screen
          name="Incorporators"
          component={Incorporators}
          options={{title: 'Incorporators', headerShown: false}}
        />
        <Stack.Screen
          name="IncorpDetails"
          component={IncorpDetails}
          options={{title: 'IncorpDetails', headerShown: false}}
        />
        <Stack.Screen
          name="AboutCorp"
          component={AboutCorp}
          options={{title: 'AboutCorp', headerShown: false}}
        />
        <Stack.Screen
          name="IncorpFinalStep"
          component={IncorpFinalStep}
          options={{title: 'IncorpFinalStep', headerShown: false}}
        />
        <Stack.Screen
          name="HSTRegistration"
          component={HSTRegistration}
          options={{title: 'HSTRegistration', headerShown: false}}
        />
        <Stack.Screen
          name="IncorpPayment"
          component={IncorpPayment}
          options={{title: 'IncorpPayment', headerShown: false}}
        />
        <Stack.Screen
          name="IncorpInProcess"
          component={IncorpInProcess}
          options={{title: 'IncorpInProcess', headerShown: false}}
        />
         <Stack.Screen
          name="Spouse"
          component={Spouse}
          options={{title: 'Spouse', headerShown: false}}
        />
        <Stack.Screen
          name="SKWebPage"
          component={SKWebPage}
          options={{title: 'SKWebPage', headerShown: false}}
        />
         <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{title: 'PaymentScreen', headerShown: false}}
        />

<Stack.Screen
          name="CRALanding"
          component={CRALanding}
          options={{title: 'CRALanding', headerShown: false}}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SKStack;
