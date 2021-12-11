import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Button,
  Text,
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import AppHeader from '../components/AppHeader';
import * as Validator from '../helpers/SKTValidator';
import {ST_REGEX} from '../constants/StaticValues';
import * as Colors from '../constants/ColorDefs';
import {incorpGetIncorporatorDetails} from '../apihelper/Api';
import * as CustomFonts from '../constants/FontsDefs';
import SignatureCapture from 'react-native-signature-capture';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IncorpDetails = props => {
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [details, setDetails] = useState();
  const [iNSNUMBER, setiNSNUMBER] = useState();
  const [mName, setMName] = useState();
  const [lName, setLName] = useState();
  const [isAuthChecked, setIsAuthChecked] = useState();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pageParams) {
      setIsLoading(true);
      const {user_id, incorporation_id, incorporator_id} = pageParams;
      const params = {
        User_Id: user_id,
        Incorporation_Id: incorporation_id,
        Incorporator_Id: incorporator_id,
      };
      incorpGetIncorporatorDetails(params, detailsRes => {
        setIsLoading(false);
        if (detailsRes?.status == 1) {
          const data = detailsRes?.data?.[0];
          setDetails(data);
          const {
            first_name,
            middle_name,
            last_name,
            
          } = data;
          setiNSNUMBER(first_name);
          setLName(last_name);
          setMName(middle_name);
          
        }
      });
    }
  }, []);

  const checkFormValidations = () => {
    let isValidForm = true;
    const isiNSNUMBERValid = Validator.isValidField(iNSNUMBER,ST_REGEX.FullName)
    const isLNameValid = Validator.isValidField(lName,ST_REGEX.FullName)
    const isMNameValid = true // Validator.isValidField(mName, ST_REGEX.LName);
    

    if (!isiNSNUMBERValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid INSTUTION NUMBER');
    } else if (!isMNameValid && 0) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Middle Name');
    } else if (!isLNameValid) {
      isValidForm = false;
      Alert.alert('SukhTax', 'Please enter valid Last Name');
    } 
    return isValidForm;
  };
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled={true}
        style={{flex: 1, width: '100%', paddingBottom: 10}}
        keyboardVerticalOffset={0}>
        {isLoading && <SKLoader />}
        <AppHeader navigation={navigation} />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}>
          <Heading value="Sukh Tax Loyalty Program"marginTop={26} />
          <Heading
            fontSize={16}
            marginTop={5}
            color={Colors.BLACK}
            value="We just need your Direct Deposit information for payout, we have the rest of your information. :"
          />
          <SKInput
            marginTop={60}
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={iNSNUMBER}
            placeholder="INSTITUTION NUMBER"
            onEndEditing={value => {
                setiNSNUMBER(value);
            }}
          />
          <SKInput
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={mName}
            placeholder="BRANCH NUMBER"
            onEndEditing={value => {
              setMName(value);
            }}
          />
          <SKInput
            
            marginBottom={2}
            maxLength={15}
            borderColor={Colors.CLR_0065FF}
            value={lName}
            placeholder="ACCOUNT NUMBER"
            onEndEditing={value => {
              setLName(value);
              console.log('======>',value )
            }}
          />
          <SKCheckbox
            isChecked={isAuthChecked}
            onToggle={() => {
              setIsAuthChecked(!isAuthChecked);
            }}
          />
          <View >
          <Button
      
        title="Click here"
        onPress = {() =>{
          navigation.navigate('RoyaltyRefHistory')
          }}/>
          </View>
         
         <View  style={{
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop : 140,
        width: '100%',
      }}>
          <View style = {{backgroundColor:"red",paddingHorizontal:120}}>
          <Button
      style = {{
        color: 'white',
        marginTop: 400,
        padding: 20,
        backgroundColor: 'white'
      }}
        title="SIGN UP"
        onPress = {() =>{
          navigation.navigate('RoyaltyWallat')
          }}/>
          </View>
       
         </View>
       
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const SKCheckbox = props => {
    const {isChecked, onToggle} = props;
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          marginTop: 20,
        }}
        onPress={() => {
          onToggle && onToggle();
        }}>
        <Icon
          name={isChecked ? 'check-box-outline' : 'checkbox-blank-outline'}
          size={30}
          color={Colors.BLUE}
        />
        <Text style={{color: Colors.BLACK, marginLeft: 10, flex: 1,fontSize:15}}>
        I agree to the terms and conditions as enclosed.
        </Text>
      </TouchableOpacity>
      
    );
  };

export default IncorpDetails;
