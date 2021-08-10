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
  Alert,
  Platform,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {useNavigation} from '@react-navigation/native';
import {useKeyboard} from '../components/useKeyboard';
import SKInput from '../components/SKInput';
import Heading from '../components/Heading';
import SKLoader from '../components/SKLoader';
import {getMessages, saveMessage} from '../apihelper/Api';
const {width} = Dimensions.get('window');
const Messages = props => {
  const navigation = useNavigation();
  const [chats, setChats] = useState();
  const [chatText, setChatText] = useState('');
  const [keyboardHeight] = useKeyboard();
  const [isLoading, setIsLoading] = useState(false);
  const userid = global.userInfo?.user_id;
  const taxFileID = global.userInfo?.tax_file_id;

  const getUpdatedMsgList = isloader => {
    setIsLoading(isloader);
    const params = {User_Id: userid, Tax_File_Id: taxFileID};
    getMessages(params, msgRes => {
      setIsLoading(false);
      if (msgRes && msgRes.status == 1) {
        const msgs = msgRes.data;
        setChats(msgs);
      } else {
        const msg =
          msgRes?.message ?? 'Something went wront, Please try again later.';
        Alert.alert('SukhTax', msg);
      }
    });
  };
  useEffect(() => {
    getUpdatedMsgList(true);
  }, []);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      <AppHeader navigation = {navigation}/>
      {isLoading && <SKLoader />}
      <View style={{width: '100%', flex: 1, paddingHorizontal: 20}}>
        <Heading value="MESSAGES" marginTop={30} />
        {chats && (
          <FlatList
            contentContainerStyle={{
              backgroundColor: Colors.WHITE,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingVertical: 20,
            }}
            style={{
              flex: 1,
              marginBottom: 85 + keyboardHeight,
            }}
            keyExtractor={(item, index) => 'key_' + index}
            data={[...chats]}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <MessageCard item={item} />}
          />
        )}
      </View>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          position: 'absolute',
          bottom: keyboardHeight
            ? keyboardHeight
            : Platform.OS == 'ios'
            ? 10
            : keyboardHeight,
        }}>
        <SKInput
          rightAccImage={CustomFonts.send_msg}
          isChatInput={true}
          onTextChange={text => {
            setChatText(text);
          }}
          onRightPressed={() => {
            if (chatText.length < 1) return;
            setIsLoading(true);
            const params = {
              User_Id: userid,
              Tax_File_Id: taxFileID,
              Message: chatText,
            };
            saveMessage(params, saveMsgRes => {
              setIsLoading(false);
              if (saveMsgRes && saveMsgRes.status == 1) {
                setChatText('');
                getUpdatedMsgList(false);
              } else {
                const msg =
                  saveMsgRes?.message ??
                  'Something went wront, Please try again later.';
                Alert.alert('SukhTax', msg);
              }
            });
          }}
          borderColor={Colors.CLR_0065FF}
          value={chatText}
          placeholder="Type a message"
          onEndEditing={value => {
            setChatText(value);
          }}
        />
      </View>
    </View>
  );
};

const MessageCard = props => {
  const {message, user_type} = props.item;
  const isUser = user_type == 'User' ? true : false;
  return (
    <View
      style={{
        width: width - 40,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}>
      <Text
        style={{
          width: '50%',
          backgroundColor: isUser ? Colors.CLR_EBEBEB : Colors.CLR_FFECEC,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 6,
          overflow: 'hidden',
          fontFamily: CustomFonts.OpenSansRegular,
        }}>
        {message}
      </Text>
    </View>
  );
};

export default Messages;
