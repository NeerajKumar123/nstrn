import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {useNavigation} from '@react-navigation/native';
import {loadIntialData} from '../helpers/BaseUtility'
import {useIsFocused} from '@react-navigation/native';
import {getUserProfileDetails} from '../apihelper/Api';

const Home = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [userFullName, setUserFullName] = useState('')
  const {tax_file_status_id = 0} = global?.onlineStatusData;
  const {incorporation_status_id = 0} = global?.incStatusData;
  const {tax_docs_status_id = 0} = global?.taxDocsStatusData;
  const {cra_letters_status_id = 0} = global?.craLattersData;

  // inprogress circular loader
  // all set green tick
  // rejected red/white cross
  let taxStatus = 3
   if (tax_file_status_id == 16) {
    taxStatus = 1
   }

   let incropStatus = 3
   if (incorporation_status_id == 3) {
    incropStatus = 1
   }
   let taxDocStatus = 3
   if (tax_docs_status_id == 3) {
    taxDocStatus = 1
   }
   let craStatus = 3
   if (cra_letters_status_id == 3) {
    craStatus = 1
   }else if (cra_letters_status_id == 4) {
    craStatus = 2
   }

   useEffect(() => {
    if(isFocused){
      setIsLoading(true);
      setTimeout(() => {
        loadIntialData((res)=>{
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        })
      }, 500);
    }
    const {user_id = 0} = global?.userInfo ? global?.userInfo : {}
    getUserProfileDetails({user_id:user_id},(userDetailsRes)=>{
      if (userDetailsRes.status == 1) {
        const user = userDetailsRes?.data?.[0]
        const fName = user?.firstname ?? ''
        const lName = user?.lastname ?? ''
        setUserFullName(fName + ' ' + lName )
      }
    })
  }, [isFocused])

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%', flex: 1}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="Home" marg æinTop={122} />
        <Heading
          fontSize={16}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`Welcome, ${userFullName}`}
        />
        <Heading
          fontSize={16}
          marginTop={25}
          color={Colors.APP_BLUE_HEADING_COLOR}
          value="RECENT REQUESTS"
        />
        {!tax_file_status_id &&
          !incorporation_status_id &&
          !tax_docs_status_id &&
          !cra_letters_status_id && (
            <Heading
              fontSize={13}
              marginTop={10}
              color={Colors.GRAY}
              value="NO RECENT REQUESTS"
            />
          )}

        {tax_file_status_id ? (
          <Heading
            fontSize={16}
            status={taxStatus}
            marginTop={15}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="TAX FILING"
            onClicked={() => {
              navigation.navigate('OnlineTaxFilingStatus');
            }}
          />
        ) : null}
        {incorporation_status_id ? (
          <Heading
            fontSize={16}
            status={0}
            status={incropStatus}
            marginTop={5}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="INCORPORATION"
            onClicked={() => {
              navigation.navigate('IncorpApplyStatus');
            }}
          />
        ) : null}

        {tax_docs_status_id ? (
          <Heading
            fontSize={16}
            status={0}
            status={taxDocStatus}
            marginTop={5}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="TAX DOCUMENTS"
            onClicked={() => {
              navigation.navigate('RequestApplyStatus');
            }}
          />
        ) : null}

        {cra_letters_status_id ? (
          <Heading
            fontSize={16}
            status={0}
            status={craStatus}
            marginTop={5}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            value="CRA LETTERS"
            onClicked={() => {
              navigation.navigate('CRALanding');
            }}
          />
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            marginTop: 46,
            justifyContent: 'space-between',
          }}>
          <ProfDoccCardView
            image={CustomFonts.profile}
            title="PROFILE"
            onClicked={() => {
              navigation.navigate('Profile');
            }}
          />
          <ProfDoccCardView
            image={CustomFonts.request}
            title="DOCUMENTS"
            onClicked={() => {
              navigation.navigate('AllDocuments');
            }}
          />
        </View>
        <MessegesView
          onClicked={() => {
            navigation.navigate('Messages');
          }}
        />
      </ScrollView>
    </View>
  );
};

const ProfDoccCardView = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '48%',
        height: 100,
        backgroundColor: Colors.PRIMARY_BORDER,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 48,
            height: 48,
          }}
          source={props.image}
        />
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '800',
            marginTop: 5,
            fontFamily: CustomFonts.OpenSansRegular,
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const MessegesView = props => {
  const {new_message_count = 0} = global.onlineStatusData;
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 90,
        backgroundColor: Colors.PRIMARY_BORDER,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
              fontFamily: CustomFonts.OpenSansRegular,
            }}>
            MESSAGES :
          </Text>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
              fontFamily: CustomFonts.OpenSansRegular,
            }}>
            {`${new_message_count} NEW MESSAGES`}
          </Text>
        </View>
        <Image
          resizeMode="contain"
          style={{
            width: 42,
            height: 38,
          }}
          source={CustomFonts.messeges}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
