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
const NumberNameCorp = props => {
  const data = [
    {corpType: 'NUMBERED', cost: 'CORPORATION'},
    {corpType: 'NAMED CORP.', cost: '$100 EXTRA'},
  ];
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCorp, setSelectedCorp] = useState();
  useEffect(() => {
    setIsLoading(8282)
  }, [isLoading])


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
        <Heading value="REGISTER A CORPORATION" marginTop={100} />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="ARE YOU LOOKING TO REGISTER
          AS A NUMBERED OR NAME
          CORPORATION?"
        />
        {data &&
          data.map((item, index) => {
            return (
              <DocCard
                item={item}
                isSelected={
                  item.corpType == selectedCorp && selectedCorp.corpType
                }
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
              navigation.navigate('UploadCorp');
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text
            style={{
              width: '60%',
              textAlign: 'center',
              color: Colors.BLACK,
              fontSize: 12,
              fontFamily: CustomFonts.OpenSansRegular,
            }}>
            DONT WORRY! ALL OUR FEES ALREADY INCLUDE GOVT. CHARGES
          </Text>
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
        flexDirection: 'column',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingVertical: 14,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        borderRadius: 6,
        // backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.CLR_7F7F9F,
        backgroundColor: Colors.CLR_E77C7E,
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.WHITE,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {item.corpType}
      </Text>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          marginTop: 3,
          color: Colors.WHITE,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {item.cost}
      </Text>
    </TouchableOpacity>
  );
};

export default NumberNameCorp;
