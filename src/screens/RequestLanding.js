import React, {useEffect, useState} from 'react';
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
import {taxDocsGetTaxDocsType, taxDocsGenerateTaxDocId} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
const RequestLanding = props => {
  const [docsTypes, setDocsTypes] = useState();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState();

  useEffect(() => {
    setIsLoading(true);
    taxDocsGetTaxDocsType({}, typeRes => {
      if (typeRes?.status == 1) {
        setIsLoading(false);
        const docs = typeRes?.data;
        setDocsTypes(docs);
      }
    });
  }, []);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 20,
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader />}
      <ScrollView
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Heading value="TAX DOCUMENTS" marginTop={60} />
        <Heading
          fontSize={16}
          marginTop={0}
          marginBottom={0}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="NEED A TAX DOCUMENT"
        />
        <Heading
          fontSize={16}
          marginTop={20}
          marginBottom={0}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WE CAN SURELY HELP YOU. PLEASE SELECT WHAT YOU NEED
          FROM BELOW:"
        />
        {docsTypes &&
          docsTypes.map((item, index) => {
            return (
              <DocCard
                key={item.tax_docs_type}
                item={item}
                onSelected={selectedValue => {
                  const newValue = {
                    ...selectedValue,
                    isSelected: !selectedValue.isSelected,
                  };
                  const index = docsTypes.findIndex(
                    x => x.tax_docs_type_id === item.tax_docs_type_id,
                  );
                  const old = [...docsTypes];
                  if (index != -1) {
                    old[index] = newValue;
                  }
                  setDocsTypes([...old]);
                }}
              />
            );
          })}
        <DocCard
          key={'staticcard'}
          isStatic={true}
          item={{fee: 'SEE DOCS REQUESTED', tax_docs_type: 'PREVIOUS REQUESTS'}}
          onSelected={() => {
            navigation.navigate('AllDocuments');
          }}
        />
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
              let sels = [];
              docsTypes?.map(item => {
                if (item.isSelected) {
                  sels.push(item);
                }
              });
              if (sels.length == 0) {
                Alert.alert(
                  'SukhTax',
                  'Please select one type of Tax Document.',
                );
                return;
              }
              global.selectedDocsTypes = sels;
              setIsLoading(true);
              const {user_id} = global.incStatusData;
              const params = {User_id: user_id};
              taxDocsGenerateTaxDocId(params, taxcDocIdRes => {
                setIsLoading(false);
                if (taxcDocIdRes?.status == 1) {
                  global.taxDocsStatusData = {
                    ...global.taxDocsStatusData,
                    ...taxcDocIdRes?.data[0],
                  };
                  navigation.navigate('RequestYears', {pageIndex: 0});
                } else {
                  Alert.alert('SukhTax', regisRes?.message);
                }
              });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {item, onSelected, isStatic = false} = props;
  const {tax_docs_type, fee, isSelected} = item;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'column',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingVertical: 14,
        alignItems: 'center',
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.CLR_E77C7E,
        backgroundColor: isSelected ? Colors.CLR_E77C7E : Colors.WHITE,
      }}
      onPress={() => {
        onSelected(item);
      }}>
      <Text
        style={{
          width: '100%',
          fontFamily: CustomFonts.OpenSansRegular,
          textAlign: 'left',
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {tax_docs_type.toUpperCase()}
      </Text>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          marginTop: 3,
          fontFamily: CustomFonts.OpenSansRegular,
          color: isSelected ? Colors.WHITE : Colors.CLR_414141,
          fontSize: 16,
          fontWeight: '700',
        }}>
        {isStatic ? `${fee}` : `TOTAL COST: ${fee}`}
      </Text>
      {isStatic && (
        <View style={{position: 'absolute', top: 25, right: 10}}>
          <Icon
            name={CustomFonts.ChevronRight}
            size={30}
            color={Colors.APP_RED_SUBHEADING_COLOR}
            opacity={1.0}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RequestLanding;
