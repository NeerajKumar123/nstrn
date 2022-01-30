import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Alert, Touchable} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import SKButton from '../components/SKButton';
import {craLattersGetStatus} from '../apihelper/Api';
import {useIsFocused} from '@react-navigation/native';


const CRALanding = props => {
  const [letters, setLetters] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const isFocused = useIsFocused();

  useEffect(() => {
    const {user_id} = global.userInfo;
    const params = {User_Id: user_id};
    setIsLoading(true)
    craLattersGetStatus(params, craRes => {
      setTimeout(() => {
        setIsLoading(false)
      }, 200);
      if (craRes?.status == 1) {
        setLetters(craRes?.data);
        const craLattersResData = craRes?.data && craRes?.data.length > 0 ? craRes?.data[0] : undefined
        global.craLattersData = craLattersResData
      } else {
        Alert.alert('SukhTax', craRes?.message);
      }
    });
  }, [isFocused]);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        flex:1,
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="CRA LETTERS" marginTop={50} />
        {letters && letters.length > 0 && 
        <KeyValueView
        title="LETTER"
        value="STATUS"
        marginTop={20}
        onClick = {()=>{}}
        titleColor={Colors.APP_RED_SUBHEADING_COLOR}
        subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
      />}
        <View>
          {letters &&
            letters.map((item, index) => {
              return (
                <KeyValueView
                  key={`${item.cra_letters_id}`}
                  title={item.title.toUpperCase()}
                  value={item.cra_letters_status_name.toUpperCase()}
                  marginTop={15}
                  fontSize={16}
                  titleColor={Colors.APP_BLUE_HEADING_COLOR}
                  subtitleColor={Colors.APP_BLUE_HEADING_COLOR}
                  onClick = {()=>{
                    navigation.navigate('CRALattersStatus',{...item});
                  }}
                />
              );
            })}
        </View>
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.APP_BLUE_HEADING_COLOR}
          borderColor={Colors.CLR_D3D3D9}
          title={'NEW CRA LETTER'}
          onPress={() => {
            navigation.navigate('NewCRALatter');
          }}
        />
      </ScrollView>
    </View>
  );
};

const KeyValueView = props => {
  const {
    marginTop = 0,
    titleColor = Colors.APP_BLUE_HEADING_COLOR,
    subtitleColor = Colors.APP_BLUE_HEADING_COLOR,
    fontSize = 20,
    onClick
  } = props;
  return (
    <TouchableOpacity
    onPress = {()=>{
      onClick()
    }}
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: marginTop,
      }}>
      <Text style={{fontWeight: '700', fontSize: fontSize, color: titleColor}}>
        {props.title}
      </Text>
      <Text
        style={{fontWeight: '700', fontSize: fontSize, color: subtitleColor}}>
        {props.value}
      </Text>
    </TouchableOpacity>
  );
};

export default CRALanding;
