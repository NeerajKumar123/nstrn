import React, { useEffect, useState } from 'react';
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
import { taxDocsSaveTypeAndYear, taxDocsFinalizeProcess, taxDocsGetTaxDocsStatus } from '../apihelper/Api';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const RequestYears = props => {
  const [years, setYears] = useState([{ year: '2016' }, { year: '2017' }, { year: '2018' }, { year: '2019' }, { year: '2020' }])
  const navigation = useNavigation();
  const pageParams = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  let { pageIndex = 0 } = pageParams
  const selectedDocsTypes = global.selectedDocsTypes
  let currentPage = selectedDocsTypes[pageIndex]
  const heading = currentPage?.tax_docs_type
  const subheading = 'WHICH YEARS DO YOU NEED THE DOCUMENT FOR?'

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 20
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value={heading} marginTop={60} />
        <Heading
          fontSize={16}
          marginTop={10}
          marginBottom={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={subheading}
        />
        {years &&
          years.map((item, index) => {
            return (
              <DocCard
                key={item.year}
                item={item}
                onSelected={(selectedValue) => {
                  const newValue = {
                    ...selectedValue,
                    isSelected: !selectedValue.isSelected,
                  };
                  const index = years.findIndex(x => x.year === item.year);
                  const old = [...years];
                  if (index != -1) {
                    old[index] = newValue;
                  }
                  setYears([...old]);
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
              let nextIndex = pageIndex + 1
              const selObj = global.selectedDocsTypes[nextIndex]
              let selYrs = []
              years?.map(item => {
                if (item.isSelected) {
                  selYrs.push(item.year)
                }
              });
              if (selYrs && selYrs.length) {
                setIsLoading(true)
                const { user_id, tax_docs_id } = global.taxDocsStatusData
                const { tax_docs_type_id } = currentPage
                const params = { User_id: user_id, Tax_Docs_Id: tax_docs_id, Tax_Docs_Type_Id: tax_docs_type_id, Years_Selected: selYrs.join() }
                taxDocsSaveTypeAndYear(params, (saveRes) => {
                  if (saveRes?.status == 1) {
                    if (tax_docs_type_id == 1 && global.selectedDocsTypes?.length == 1) {
                      const params = { User_Id: user_id, Tax_Docs_Id: tax_docs_id }
                      taxDocsFinalizeProcess(params, (finalRes) => {
                        if (finalRes?.status == 1) {
                          const params = { User_Id: user_id }
                          taxDocsGetTaxDocsStatus(params, (taxDocsRes) => {
                            setIsLoading(false)
                            if (taxDocsRes?.status == 1) {
                              const taxDocsResData = taxDocsRes?.data && taxDocsRes?.data.length > 0 ? taxDocsRes?.data[0] : undefined
                              global.taxDocsStatusData = taxDocsResData ? { ...taxDocsResData, ...global.userInfo } : { ...global.taxDocsResData, ...global.userInfo }
                              navigation.navigate('RequestApplyStatus',{shouldGoToHome:true});
                            } else {
                              setIsLoading(false)
                              Alert.alert('SukhTax', taxDocsRes?.message)
                            }
                          })
                        } else {
                          setIsLoading(false)
                          Alert.alert('SukhTax', finalRes?.message)
                        }
                      })
                    } else if (selObj) {
                      setIsLoading(false)
                      const newPageIndex = pageIndex + 1
                      navigation.push('RequestYears', { pageIndex: newPageIndex });
                    } else {
                      setIsLoading(false)
                      navigation.navigate('RequestPaymentDetails');
                    }
                  } else {
                    setIsLoading(false)
                    Alert.alert('SukhTax', regisRes?.message)
                  }
                })
              } else {
                Alert.alert('Sukhtax', 'Please select year.')
              }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const { item, onSelected } = props;
  const { year, isSelected } = item
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'column',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.CLR_E77C7E,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      onPress={() => {
        onSelected(item)
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {year.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default RequestYears;
