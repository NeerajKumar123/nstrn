import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, ScrollView, Image, Alert} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import * as CustomFonts from '../constants/FontsDefs';
import {onlineSaveMyYearInfo} from '../apihelper/Api';
import SKLoader from '../components/SKLoader';

const MyTaxYear = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([
    {title: 'I WAS EMPLOYED', value: 'I_was_employed', isSelected: false},
    {
      title: 'I DROVE UBER/LYFT ETC.',
      value: 'I_drove_uber_lyft_etc',
      isSelected: false,
    },
    {
      title: 'I OWNED A RENTAL PROPERTY',
      value: 'I_owned_a_rental_property',
      isSelected: false,
    },
    {
      title: 'I HAD OTHER SELF EMPLOYMENT INCOME',
      value: 'I_had_other_self_employment_income',
      isSelected: false,
    },
    {
      title: 'I PAID RENT AND HAVE RENT RECEIPTS',
      value: 'I_paid_rent_and_have_rent_receipts',
      isSelected: false,
    },
  ]);
  const [mySelf, setMySelf] = useState();
  const [spouse, setSpouse] = useState();

  function ifObjExist(arr, obj, mappingKey) {
    return arr.some(function (el) {
      console.log(el[mappingKey], obj[mappingKey]);
      return el[mappingKey] === obj[mappingKey];
    });
  }

//   User_Id:	
// Tax_File_Id:	
// Year:	
// Details_For:	
// I_was_employed:	
// I_drove_uber_lyft_etc:	
// I_owned_a_rental_property:	
// I_had_other_self_employment_income:	
// I_paid_rent_and_have_rent_receipts:
const prepareParams = () => {
  const {
    user_id,
    tax_file_id = 83,
    Tax_File_Id,
    tax_file_year_id,
  } = global.userInfo;
  let params = {
    User_id: user_id,
    Tax_File_Id: tax_file_id || Tax_File_Id,
    Year:2020,
    Details_For: 0,
  };
  data.map((item) => {
    console.log('item',item)
    if(item.isSelected){
      params[item.value] = 1
    }else{
      params[item.value] = 0
    }
  })
  console.log('params',params)
    return params;
};


  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%', marginBottom: 50}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          marginBottom: 50,
        }}>
        <Heading value="MY TAX YEAR" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="LETS HAVE A LOOK AT HOW YOUR TAX YEAR 2018 WENT!"
        />
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.CLR_D9272A}
          value="PLEASE SELECT ALL THAT APPLY"
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <User
            height={50}
            marginTop={0}
            width="48%"
            bgColor={Colors.CLR_29295F}
            item={{title: 'MY SELF'}}
            isSelected={mySelf}
            onSelected={() => {
              console.log('data');
              setMySelf(!mySelf);
            }}
          />
          <User
            height={50}
            marginTop={0}
            width="48%"
            bgColor={Colors.CLR_29295F}
            item={{title: 'SPOUSE'}}
            isSelected={spouse}
            onSelected={() => {
              console.log('data');
              setSpouse(!spouse);
            }}
          />
        </View>
        {console.log('sdsds', data)}
        {data &&
          data.map((item, index) => {
            return (
              <DocOptionCard
                item={item}
                key={item.value}
                onSelected={selectedValue => {
                  const newValue = {
                    ...selectedValue,
                    isSelected: !selectedValue.isSelected,
                  };
                  const index = data.findIndex(x => x.value === item.value);
                  const old = data;
                  if (index != -1) {
                    old[index] = newValue;
                  }
                  setData([...old]);
                  if (mySelf) {
                  }
                  if (spouse) {
                  }
                }}
              />
            );
          })}
        <SKButton
          marginTop={30}
          fontSize={16}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'DOCUMENTS'}
          onPress={() => {
            // console.log('link pressed', mySelfOptions, spouseOptions, data);
            setIsLoading(true)
          const params = prepareParams()
            onlineSaveMyYearInfo(params, (saveYrRes) =>{
              setIsLoading(false)
              if(saveYrRes?.status == 1){
                navigation.navigate('OnlineDocuments');
              }else{
                Alert.alert('SukhTax', 'Something wrong')
              }
            })
          }}
        />
      </ScrollView>
    </View>
  );
};

const User = props => {
  const {
    item,
    height = 44,
    fontSize = 15,
    width = '48%',
    marginTop = 15,
    isSelected = false,
  } = props;

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: marginTop,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor: isSelected ? 'red' : Colors.CLR_29295F,
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: fontSize,
          fontWeight: '700',
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

const DocOptionCard = props => {
  const {
    item,
    height = 44,
    fontSize = 15,
    width = '100%',
    marginTop = 15,
    options,
    onSelected,
  } = props;

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: marginTop,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor: item.isSelected ? 'red' : Colors.CLR_29295F,
      }}
      onPress={() => {
        onSelected && onSelected(item);
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: fontSize,
          fontWeight: '700',
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default MyTaxYear;
