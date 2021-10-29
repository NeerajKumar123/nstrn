import React, {useState, useEffect} from 'react';
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
import {
  onlineGetDependentInfoByUserId,
  onlineGetDependentInfoByTaxFileID,
  onlineSaveDependentInfo,
} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import {useIsFocused} from '@react-navigation/native';

const DependentsList = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false);
  const [lastYearDeps, setLastYearDeps] = useState([]);
  const [saveCount, setsaveCount] = useState(0);
  const [deps, setDeps] = useState([]);
  const {user_id, tax_file_id} = global.onlineStatusData;
  const Tax_Filed_With_Sukhtax = 1

  useEffect(() => {
    if (isFocused) {
      getDepsByTaxFileId()
    }
  }, [isFocused]);

  useEffect(() => {
    if (Tax_Filed_With_Sukhtax && !global.isLastDepHit) {
      onlineGetDependentInfoByUserId({User_Id: user_id}, lastdepRes => {
        if (lastdepRes.status == 1) {
          const deps = lastdepRes.data;
          setLastYearDeps(deps);
          global.isLastDepHit = true;
        }
      });
    }
  }, []);

  useEffect(() => {
    if (lastYearDeps) {
      lastYearDeps.forEach(({obj, index}) => {
        console.log('Obj', obj);
        const params = prepareParams(obj);
        onlineSaveDependentInfo(params, saveRes => {
          console.log('saveRes====>', saveRes);
          setsaveCount(saveCount+1)
        });
      });
    }
  }, [lastYearDeps]);

  const getDepsByTaxFileId = () => {
    onlineGetDependentInfoByTaxFileID(
      {User_Id: user_id, Tax_File_Id: tax_file_id},
      depResByTaxFileID => {
        if (depResByTaxFileID.status == 1) {
          setDeps(deps);
        }
      },
    );
  };

  useEffect(() => {
    if (saveCount == lastYearDeps.length) {
      getDepsByTaxFileId();
    }
  }, [saveCount]);


  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
        }}>
        <Heading value="DEPENDENTS" marginTop={30} />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={30}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="THIS IS SOMEONE WHO RELIES ON YOU FOR FINANCIAL SUPPORT"
        />
        <TouchableOpacity
          style={{width: '100%', flexDirection: 'row'}}
          onPress={() => {
            navigation.navigate('DependentDetails');
          }}>
          <Image
            resizeMode="contain"
            style={{width: 30, height: 30, alignSelf: 'center'}}
            source={CustomFonts.add_filled_circle}
          />
          <Text
            style={{
              color: Colors.APP_RED_SUBHEADING_COLOR,
              fontFamily: CustomFonts.OpenSansSemiBold,
              fontSize: 20,
              marginLeft: 23,
              fontWeight: '700',
            }}>
            ADD DEPENDENT
          </Text>
        </TouchableOpacity>
        {deps &&
          deps.map((item, index) => {
            return (
              <DocCard
                key={name}
                item={item}
                onSelected={() => {
                //   navigation.navigate('DependentDetails', {...item});
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
            disable={!deps || deps?.length < 1}
            fontSize={16}
            marginTop={30}
            rightImage={CustomFonts.right_arrow}
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'MY TAX YEAR'}
            onPress={() => {
                navigation.navigate('MyTaxYear', { pageIndex: 0 });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item, isSelected} = props;
  const {incorporator_name} = item;
  if (!incorporator_name) return null;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        marginTop: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        borderRadius: 6,
        paddingRight: 20,
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Icon
        name={'square-edit-outline'}
        size={27}
        color={Colors.APP_BLUE_HEADING_COLOR}
      />
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
        {incorporator_name?.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default DependentsList;
