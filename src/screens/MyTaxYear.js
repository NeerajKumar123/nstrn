import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
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
  const pageParams = props.route.params;
  let {pageIndex = 0} = pageParams
  const selectedYears = global.selectedYears
  const currentYear = selectedYears && selectedYears[pageIndex] ? selectedYears[pageIndex] : global.mostRecentYear
  const buttonTitle = selectedYears && selectedYears[pageIndex + 1] ? selectedYears[pageIndex + 1] : 'DOCUMENTS'

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

  const [spouseData, setSpouseData] = useState([
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
  const [isSelfSelected, setIsSelfSelected] = useState(true)
  const [isSpouseSelected, setIsSpouseSelected] = useState(false)

  const prepareParams = (flag) => {
    const {
      user_id,
      tax_file_id,
    } = global.onlineStatusData

    let params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id,
      Year: currentYear,
      Details_For: flag ? 0 : 1,
    };
    data?.map(item => {
      if (item.isSelected) {
        params[item.value] = 1;
      } else {
        params[item.value] = 0;
      }
    });
    return params;
  };


  const saveMyAndSpouseInfo =(callback) =>{
    setIsLoading(true);
    const params = prepareParams(false);
    onlineSaveMyYearInfo(params, saveYrRes => {
      if (saveYrRes?.status == 1) {
        const params = prepareParams(true);
        onlineSaveMyYearInfo(params, saveYrResInner => {
          if(saveYrResInner?.status == 1){
            setIsLoading(false);
            callback({status:1})
          }else{
            Alert.alert('SukhTax', 'Something wrong');
          }
        })                     
      } else {
        Alert.alert('SukhTax', 'Something wrong2');
      }
    });
  }

  const saveMyInfoOnly =(callback) =>{
    setIsLoading(true);
    const params = prepareParams(false);
    onlineSaveMyYearInfo(params, saveYrRes => {
      setIsLoading(false);
      if (saveYrRes?.status == 1) {
        callback({status:1})    
      } else {
        // callback({status:0})
        Alert.alert('SukhTax', 'Something wrong');
      }
    });
  }
  const saveSpouseInfoOnly =(callback) =>{
    setIsLoading(true);
    const params = prepareParams(true);
    onlineSaveMyYearInfo(params, saveYrRes => {
      setIsLoading(false);
      if (saveYrRes?.status == 1) {
        callback({status:1})    
      } else {
        // callback({status:0})
        Alert.alert('SukhTax', 'Something wrong');
      }
    });
  }

  const decideAndNavigate =(callback) =>{
    let nextIndex = pageIndex + 1
    const selObj = global.selectedYears && global.selectedYears.length > nextIndex  ? global.selectedYears[nextIndex] : undefined
    if(selObj){
      const newPageIndex = pageIndex + 1
      navigation.push('MyTaxYear',{pageIndex:newPageIndex});
    }else{
      navigation.navigate('OnlineDocuments');
    }
}

  const checkFormValidations = () =>{
    let isValidForm = true;
    console.log('isSelfSelected',isSelfSelected)
    if (isSelfSelected) {
      const selected = data && data.filter((x) => x.isSelected);
      console.log('self selected',selected)
      if(!selected?.length){
        isValidForm = false
        Alert.alert('SukhTax','Please select atleast one option for MY SELF.')
      }
    }
    if(isSpouseSelected){
      const selected = spouseData && spouseData.filter((x) => x.isSelected);
      console.log('spouse selected',selected)
      if(!selected?.length){
        isValidForm = false
        Alert.alert('SukhTax', 'Please select atleast one option for SPOUSE.')
      }
    }
    return isValidForm
  }

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%', flex:1}}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value={`MY TAX YEAR ${currentYear}`} marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`LET'S HAVE A LOOK AT HOW YOUR TAX YEAR ${currentYear} WENT!`}
        />
        <Heading
          fontSize={20}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="PLEASE SELECT ALL THAT APPLY"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            borderRadius:8,
            overflow:'hidden',
            borderColor:Colors.PRIMARY_BORDER,
            borderWidth:1
          }}>
          <User
            height={40}
            marginTop={0}
            width={global.isFromSpouseFlow ? '50%' : '100%' } 
            bgColor={Colors.APP_BLUE_HEADING_COLOR}
            item={{title: 'MY SELF'}}
            isSelected={isSelfSelected}
            onSelected={() => {
              setIsSelfSelected(true)
              setIsSpouseSelected(false)
            }}
          />
          {global.isFromSpouseFlow&&  
          <>
          <View style = {{backgroundColor:Colors.GRAY, width:1}}/>
          <User
          height={40}
          marginTop={0}
          width="50%"
          bgColor={Colors.APP_BLUE_HEADING_COLOR}
          item={{title: 'SPOUSE'}}
          isSelected={isSpouseSelected}
          onSelected={() => {
            setIsSelfSelected(false)
            setIsSpouseSelected(true)
      }}
        />
        </>
    }
        </View>
        { isSelfSelected &&
          data?.map((item, index) => {
            return (
              <DocOptionCard
                item={item}
                key={item.value}
                onSelected={selectedValue => {
                  const newValue = {
                    ...selectedValue,
                    isSelected: !selectedValue.isSelected,
                  };
                  console.log('newValue',newValue)
                  const index = data.findIndex(x => x.value === item.value);
                  console.log('index',index)
                  const old = data;
                  if (index != -1) {
                    old[index] = newValue;
                  }
                  setData([...old]);
                }}
              />
            );
          })}

          {isSpouseSelected &&
          spouseData?.map((item, index) => {
            return (
              <DocOptionCard
                item={item}
                key={item.value}
                onSelected={selectedValue => {
                  const newValue = {
                    ...selectedValue,
                    isSelected: !selectedValue.isSelected,
                  };
                  const index = spouseData.findIndex(x => x.value === item.value);
                  const old = spouseData;
                  if (index != -1) {
                    old[index] = newValue;
                  }
                  setSpouseData([...old]);
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
          title={buttonTitle}
          onPress={() => {
            if(checkFormValidations()){
              if(global.isFromSpouseFlow && isSpouseSelected && isSelfSelected){
                saveMyAndSpouseInfo((res)=>{
                  decideAndNavigate()
                })
              }else if(global.isFromSpouseFlow && !isSelfSelected && isSpouseSelected){
                saveSpouseInfoOnly((res)=>{
                  decideAndNavigate()
                })
              }else if(!isSpouseSelected && isSelfSelected){
                saveMyInfoOnly((res)=>{
                  decideAndNavigate()
                })
              }
            }
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
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor: isSelected ? Colors.CLR_DF9A9B : Colors.WHITE,
      }}
      onPress={() => {
        props.onSelected && props.onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
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
    onSelected,
  } = props;
  const {isSelected} = item


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
        borderWidth:1,
        borderColor: Colors.CLR_E77C7E,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      onPress={() => {
        onSelected && onSelected(item);
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: fontSize,
          fontWeight: '700',
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default MyTaxYear;
