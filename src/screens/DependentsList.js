import React, { useState, useEffect } from 'react';
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
import SKButton, { Link } from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import { useNavigation } from '@react-navigation/native';
import {
  onlineGetDependentInfoByUserId,
  onlineGetDependentInfoByTaxFileID,
  onlineSaveDependentInfo,
  onlineDeteleDependent
} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import { useIsFocused } from '@react-navigation/native';
import {format} from 'date-fns';

const DependentsList = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [deps, setDeps] = useState([]);
  const { Tax_Filed_With_Sukhtax, user_id, tax_file_id } = global.onlineStatusData;


  const prepareParams = (obj) => {
    const { user_id, tax_file_id } = global.onlineStatusData
    const params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id,
      DOB: obj.DOB,
      Gender: obj.gender,
      SIN_Number: obj.SIN_Number,
      Relationship: obj.Relationship,
      First_Name: obj.first_name,
      Last_Name: obj.last_name,
    }
    return params
  }


  useEffect(() => {
    console.log('isFocused', isFocused,global.isLastDepHit,Tax_Filed_With_Sukhtax)
    if (!isFocused) return
    if (Tax_Filed_With_Sukhtax && global.isLastDepHit == undefined) {
      setIsLoading(true);
      onlineGetDependentInfoByUserId({ User_Id: user_id }, lastdepRes => {
        global.isLastDepHit = true;
        if (lastdepRes.status == 1 && lastdepRes.data?.length > 0) {
          lastdepRes.data?.forEach((obj,index) => {
            const params = prepareParams(obj);
            onlineSaveDependentInfo(params, saveRes => {
              if (index == lastdepRes.data.length - 1) {
                setIsLoading(true);
                onlineGetDependentInfoByTaxFileID(
                  { User_Id: user_id, Tax_File_Id: tax_file_id },
                  depResByTaxFileID => {
                    if (depResByTaxFileID.status == 1) {
                      setDeps(depResByTaxFileID.data);
                      setIsLoading(false);
                    }
                  },
                );
              }
            });
          });
        } else {
          // get data
          setIsLoading(true);
          onlineGetDependentInfoByTaxFileID(
            { User_Id: user_id, Tax_File_Id: tax_file_id },
            depResByTaxFileID => {
              if (depResByTaxFileID.status == 1) {
                console.log('depResByTax====>', depResByTaxFileID);
                setDeps(depResByTaxFileID.data);
                setIsLoading(false);
              }
            },
          );
        }
      });
    } else {
      // get data
      setIsLoading(true);
      onlineGetDependentInfoByTaxFileID(
        { User_Id: user_id, Tax_File_Id: tax_file_id },
        depResByTaxFileID => {
          if (depResByTaxFileID.status == 1) {
            console.log('depResByTax====>', depResByTaxFileID);
            setDeps(depResByTaxFileID.data);
            setIsLoading(false);
          }
        },
      );
    }
  }, [isFocused]);

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
        style={{ width: '100%' }}
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
        <View style={{ marginVertical: 20, justifyContent: 'center' }}>
          {deps &&
            deps.map((item, index) => {
              return (
                <DepCard
                  item={item}
                  onSelected={() => {
                    //   navigation.navigate('DependentDetails', {...item});
                  }}
                  onDelete={() => {
                    console.log('item', item)
                    const options = [
                      {
                        text: 'Cancel',
                        onPress: () => {
                        }
                      },
                      {
                        text: 'Yes,Remove',
                        onPress: () => {
                          const { user_id, tax_file_id } = global.onlineStatusData;
                          const params = {
                            User_id: user_id,
                            Tax_File_Id: tax_file_id,
                            Tax_File_Dependent_Id: item.tax_file_dependent_id
                          }
                          setIsLoading(true)
                          onlineDeteleDependent(params, deleteRes => {
                            console.log('params', deleteRes)
                            if (deleteRes.status == 1) {
                              setTimeout(() => {
                                onlineGetDependentInfoByTaxFileID(
                                  { User_Id: user_id, Tax_File_Id: tax_file_id },
                                  depResByTaxFileID => {
                                    if (depResByTaxFileID.status == 1) {
                                      console.log('depResByTax====>', depResByTaxFileID);
                                      setDeps(depResByTaxFileID.data);
                                      setIsLoading(false);
                                    }
                                  },
                                );
                              }, 200);
                            }
                          })
                        }
                      }
                    ]
                    Alert.alert('SukhTax', 'Are you sure you want to remove this dependent?', options)
                  }}

                />
              );
            })}
        </View>
        <TouchableOpacity
          style={{ width: '100%', flexDirection: 'row' }}
          onPress={() => {
            navigation.navigate('DependentDetails');
          }}>
          <Image
            resizeMode="contain"
            style={{ width: 30, height: 30, alignSelf: 'center' }}
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
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop:60
          }}>
          <SKButton
            disable={!deps || deps?.length < 1}
            fontSize={16}
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

const DepCard = props => {
  const { item, onDelete = () => { } } = props;
  const { first_name, last_name, Relationship } = item;
  if (!first_name) return null;
  return (
    <View
      style={{
        backgroundColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          color: Colors.APP_BLUE_HEADING_COLOR,
          fontSize: 18,
          fontFamily: CustomFonts.OpenSansRegular,
          fontWeight: '700',
        }}>
        {`${first_name.toUpperCase()} ${last_name.toUpperCase()}`}
        <Text
          style={{
            width: '100%',
            textAlign: 'left',
            color: Colors.APP_BLUE_HEADING_COLOR,
            fontSize: 13,
            fontFamily: CustomFonts.OpenSansRegular,
            fontStyle: 'italic',
          }}>
          {`  (${Relationship})`}
        </Text>
      </Text>
      <TouchableOpacity
        style={{ position: 'absolute', right: 0, width: 40, height: '100%', alignItems: 'flex-end' }}
        onPress={() => {
          onDelete();
        }}>
        <Icon
          style={{ right: 10, position: 'absolute' }}
          name={'minus-circle-outline'}
          size={25}
          color={Colors.RED}
        />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: Colors.BLACK,
          height: 0.4,
          width: '85%',
          marginTop: 10,
        }}
      />
    </View>
  );
};

export default DependentsList;
