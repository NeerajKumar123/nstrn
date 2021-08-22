import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Alert} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as Colors from '../constants/ColorDefs';
import SKButton from '../components/SKButton';
import {craLattersGetStatus} from '../apihelper/Api';

const CRALanding = props => {
  const [letters, setLetters] = useState();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const {user_id} = global.userInfo;
    const params = {User_Id: user_id};
    setIsLoading(true)
    craLattersGetStatus(params, craRes => {
      setIsLoading(false)
      if (craRes?.status == 1) {
        setLetters(craRes?.data);
        const craLattersResData = craRes?.data && craRes?.data.length > 0 ? craRes?.data[0] : undefined
        global.craLattersData = craLattersResData
        console.log('global.craLattersData',global.craLattersData)
      } else {
        setIsLoading(false);
        Alert.alert('SukhTax', craRes?.message);
      }
    });
  }, []);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="CRA LETTERS" marginTop={100} />
        <KeyValueView
          title="LETTER"
          value="STATUS"
          marginTop={20}
          titleColor={Colors.APP_RED_SUBHEADING_COLOR}
          subtitleColor={Colors.APP_RED_SUBHEADING_COLOR}
        />
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
                />
              );
            })}
        </View>
        <SKButton
          marginTop={56}
          fontSize={16}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.SECONDARY_FILL}
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
  } = props;
  return (
    <View
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
    </View>
  );
};

export default CRALanding;
