import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const left_arrow = require('../../assets/left_arrow.png');
const right_arrow = require('../../assets/right_arrow.png');
const OnlineDocuments = props => {
  const navigation = useNavigation();

  const data = [{year: '2018'}, {year: '2018'}, {year: '2018'}];
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="DOCUMENTS" marginTop={122} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="THIS IS WHERE YOU CAN MANAGE ALL DOCUMENTS UPLOADED TO SUKHTAX:"
        />
        {data &&
          data.map((item, index) => {
            return (
              <DocCard
                item={item}
                onSelected={() => {
                  console.log('data', item);
                }}
              />
            );
          })}
        <UploadedFilesStatus count={3} />
        <ManageDocButton
          grads={[Colors.CLR_29295F, Colors.CLR_29295F]}
          title="MANAGE DOCUMENTS"
          onClicked={() => {
            navigation.navigate('ManageDocuments');
          }}
        />
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'AUTHORIZATION'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('AuthorizerList');
          }}
        />
      </ScrollView>
    </View>
  );
};

const ManageDocButton = props => {
  return (
    <LinearGradient
      opacity={0.8}
      colors={props.grads}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 56,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '700',
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const DocCard = props => {
  const {item} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
      }}
      onPress={() => {
        props.onClicked && props.onClicked();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.CLR_29295F,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {`${item.year} DOCUMENTS`}
      </Text>
      <Icon
        style={{position: 'absolute', right: 20}}
        name="plus-circle-outline"
        size={30}
        color={Colors.CLR_D9272A}
      />
    </TouchableOpacity>
  );
};

const UploadedFilesStatus = props => {
  const {count} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
      }}
      onPress={() => {
        props.onClicked && props.onClicked();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.CLR_D9272A,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {` DOC UPLOADED :${count} FILE${count > 1 ? 'S' : ''}`}
      </Text>
    </TouchableOpacity>
  );
};

export default OnlineDocuments;
