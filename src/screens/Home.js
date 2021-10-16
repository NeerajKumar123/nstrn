import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {useNavigation} from '@react-navigation/native';

const Home = props => {
  const navigation = useNavigation();
  const userFullName = global.userInfo
    ? `${global.userInfo.firstname} ${global.userInfo.lastname}`
    : '';
  const {tax_file_status_id = 0} = global?.onlineStatusData;
  const {incorporation_status_id = 0} = global?.incStatusData;
  const {tax_docs_status_id = 0} = global?.taxDocsStatusData;
  const {cra_letters_status_id = 0} = global?.craLattersData;

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      <AppHeader navigation={navigation} />
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
            status={tax_file_status_id >= 16 ? 3 : 2}
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
            status={incorporation_status_id}
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
            status={tax_docs_status_id}
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
            status={cra_letters_status_id}
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
