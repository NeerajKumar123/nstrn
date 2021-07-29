import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
  DeviceEventEmitter,
  Keyboard,
  Platform,
  Text,
} from 'react-native';
import SKInput from '../components/SKInput';
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {login} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const Incorporators = props => {
  const data = [{name: 'JAPJOT SINGH'}, {name: 'JOHN SMITH'}];
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCorp, setSelectedCorp] = useState();

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="INCOPORATORS" marginTop={100} />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="LET'S ADD THE
          INCORPORATORS' DETAILS"
        />
        <TouchableOpacity style={{width: '100%', flexDirection: 'row'}}>
          <Icon
            style={{marginRight: 0}}
            name={'close-circle-outline'}
            size={30}
            color={Colors.RED}
          />
          <Text
            style={{
              color: Colors.APP_RED_SUBHEADING_COLOR,
              fontFamily: CustomFonts.OpenSansSemiBold,
              fontSize: 20,
              marginLeft: 23,
              fontWeight: '700',
            }}>
            ADD INCORPORATOR
          </Text>
        </TouchableOpacity>
        {data &&
          data.map((item, index) => {
            return (
              <DocCard
                item={item}
                onSelected={() => {
                  console.log('data', item);
                  setSelectedCorp(item);
                }}
              />
            );
          })}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}>
          <SKButton
            fontSize={16}
            marginTop={30}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'NEXT'}
            onPress={() => {
              navigation.navigate('IncorpDetails');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item, isSelected} = props;
  console.log('isSelected', isSelected);
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        marginTop: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        borderRadius: 6,
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Icon name={'square-edit-outline'} size={27} color={Colors.APP_BLUE_HEADING_COLOR} />
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 20,
          fontFamily: CustomFonts.OpenSansRegular,
          fontWeight: '700',
          marginLeft: 23,
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Incorporators;
