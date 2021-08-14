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
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState();
  const [buttonTitle, setButtonTitle] = useState('DOCUMENTS')

  useEffect(() => {
    setCurrentYear(global.selectedYears && currentYearIndex < global.selectedYears.length  ? global.selectedYears[currentYearIndex] : '2020.');
    const length = global.selectedYears ? global.selectedYears.length : 0
    const nextIndex = currentYearIndex + 1
    if(nextIndex < length){
        const title = global.selectedYears[nextIndex]
        // setButtonTitle(title)
        setButtonTitle('NEXT')
    }
  }, [currentYearIndex]);

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


  const prepareParams = (flag) => {
    const {
      user_id,
      tax_file_id,
    } = global.onlineStatusData

    let params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id,
      Year: 2020,
      Details_For: flag ? 0 : 1,
    };
    data.map(item => {
      if (item.isSelected) {
        params[item.value] = 1;
      } else {
        params[item.value] = 0;
      }
    });
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
        <Heading value={`MY TAX YEAR ${currentYear}`} marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`LETS HAVE A LOOK AT HOW YOUR TAX YEAR ${currentYear} WENT!`}
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
          }}>
          <User
            height={50}
            marginTop={0}
            width={global.isFromSpouseFlow ? '48%' : '100%' } 
            bgColor={Colors.APP_BLUE_HEADING_COLOR}
            item={{title: 'MY SELF'}}
            isSelected={mySelf}
            onSelected={() => {
              setMySelf(!mySelf);
            }}
          />
          {global.isFromSpouseFlow && 
          <User
          height={50}
          marginTop={0}
          width="48%"
          bgColor={Colors.APP_BLUE_HEADING_COLOR}
          item={{title: 'SPOUSE'}}
          isSelected={spouse}
          onSelected={() => {
            setSpouse(!spouse);
          }}
        />
          }
          
        </View>
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
          title={buttonTitle}
          onPress={() => {
            if(mySelf || (spouse && isFromSpouseFlow)){
              const selected = data && data.filter((x) => x.isSelected);
              if(!selected?.length){
                Alert.alert('SukhTax',global.isFromSpouseFlow ?  'Please select atleast one option for MYSELF OR SPOUSE' : 'Please select atleast one option for MYSELF')
                return
              }
              setIsLoading(true);
              const params = prepareParams(false);
              onlineSaveMyYearInfo(params, saveYrRes => {
                if (saveYrRes?.status == 1) {
                  const params = prepareParams(true);
                  onlineSaveMyYearInfo(params, saveYrRes => {
                    setIsLoading(false);
                    const length = global.selectedYears ? global.selectedYears.length : 0
                    const nextIndex = currentYearIndex + 1
                    if (nextIndex < length) {
                      setCurrentYearIndex(nextIndex);
                    } else {
                      navigation.navigate('OnlineDocuments');
                    }
                  })                     
                } else {
                  Alert.alert('SukhTax', 'Something wrong');
                }
              });
            }else{
              Alert.alert('SukhTax', global.isFromSpouseFlow ? 'Please select one option from MYSELF OR SPOUSE' : 'Please select MYSELF')
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
        borderRadius: 6,
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor: isSelected ? Colors.PRIMARY_FILL : Colors.CLR_7F7F9F,
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
        backgroundColor: item.isSelected ? Colors.PRIMARY_FILL : Colors.CLR_7F7F9F,
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
