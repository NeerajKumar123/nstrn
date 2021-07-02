import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import SKButton from '../components/SKButton';
import SKInput from '../components/SKInput';
const send_msg = require('../../assets/send_msg.png');
const left_arrow = require('../../assets/left_arrow.png');
const {width} = Dimensions.get('window');
const Messages = props => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([
    {msg: 'This is from sukhtax', flag: true},
    {msg: 'This is from user', flag: false},
    {msg: 'This is from sukhtax', flag: true},
    {msg: 'This is from sukhtax', flag: true},
    {msg: 'This is from user', flag: false},
    {msg: 'This is from sukhtax', flag: true},
  ]);
  const [chatText, setChatText] = useState('');
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      <AppHeader
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        style={{width: '100%', flex: 1, paddingHorizontal:20}}>
        <Heading value="MESSAGES" marginTop={30} />
        {chats && (
          <FlatList
            contentContainerStyle={{
              backgroundColor: Colors.WHITE,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingVertical:20
            }}
            keyExtractor={(item, index) => 'key_' + index}
            data={[...chats]}
            renderItem={({item}) => <MessageCard item={item} />}
          />
        )}
        
      </KeyboardAvoidingView>
      <View
          style={{
            backgroundColor: 'white',
            width: '100%',
          }}>
          <SKInput
            marginTop={50}
            maxLength={10}
            rightAccImage={send_msg}
            isChatInput={true}
            onRightPressed={() => {
              console.log('onRightPressed');
            }}
            borderColor={Colors.CLR_0065FF}
            value={chatText}
            placeholder="Enter your query"
            onEndEditing={value => {
              console.log('onEndEditing', value);
              setChatText(value);
            }}
          />
        </View>
    </View>
  );
};

const MessageCard = props => {
  const {flag, msg} = props.item;
  return (
    <View
      style={{
        width: width - 40,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: flag ? 'flex-start' : 'flex-end',
      }}>
      <Text
        style={{
          width: '50%',
          backgroundColor: flag ? 'gray' : 'pink',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 6,
          overflow: 'hidden',
        }}>
        {msg}
      </Text>
    </View>
  );
};

export default Messages;
