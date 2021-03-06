import React, {useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs'
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {finalizeOnlineProcess} from '../apihelper/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OnlineAllDone = props => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1
      }}>
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%', marginBottom:100}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom:10
        }}>
      <View style={{marginTop: 50, justifyContent:'center', alignItems:'center'}}>
        <Image
          resizeMode="contain"
          style={{width: 136, height: 150}}
          source={CustomFonts.header_logo}
        />
      </View>

        <Heading value="WE'RE ALL" marginTop={60} />
        <Heading value="DONE HERE!" marginTop={-10} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE WILL PROCESS YOUR DOCUMENTS AND PROVIDE YOU WITH A FEE QUOTE."
        />
       <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE WILL NOTIFY YOU WITH YOUR REQUIRED PAYMENT SHORTLY."
        />
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          position: 'absolute',
          bottom: 50,
          paddingHorizontal:20
        }}>
        <SKButton
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          height = {50}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'RETURN HOME'}
          onPress={() => {
            const {user_id,tax_file_id} = global.onlineStatusData
            const params = {
              User_Id: user_id,
              Tax_File_Id: tax_file_id
            };
            setIsLoading(true)
            finalizeOnlineProcess(params,(finalizeRes) =>{
              setIsLoading(false)
              navigation.popToTop()
            })
          }}
        />
      </View>
    </View>
  );
};

export default OnlineAllDone;
