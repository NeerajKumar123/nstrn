import React, {useState,useEffect} from 'react';
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
import SKButton, {Link} from '../components/SKButton';
import Heading from '../components/Heading';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import {getTaxReturnsDocs} from '../apihelper/Api';
import * as SKTStorage from '../helpers/SKTStorage';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

const Edit_Form_Options = [
    {name:"About Info", screen:'BasicInfo'},
    {name:"Banking & Family Info", screen:'BankingAndMore'},
    {name:"Spouse Info", screen:'Spouse'},
    {name:"Dependents",screen:'DependentsList'},
    {name:"My Tax Year",screen:'MyTaxYear'},
    // {name:"My Tax Year for other Years"},
    {name:"Manage Documents", screen:'OnlineDocuments'},
]

const OnlineEditInfo = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

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
        <Heading value="EDIT INFORMATION" marginTop={50} />
        <Heading
          fontSize={16}
          marginTop={20}
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value="WHICH OF THE FOLLOWING AREAS DO YOU WANT TO EDIT ?"
        />

        {Edit_Form_Options &&  Edit_Form_Options.map((elem) =>{
            return(
                <DocCard
                title={elem.name}
                onSelected={() => {
                    console.log('elem',elem)
                    if (elem.screen) {
                        navigation.navigate(elem.screen,{isEditing:true})
                    }
                }}
              />
            )
        })
        }
       
      </ScrollView>
    </View>
  );
};

const DocCard = props => {
  const {title,onSelected = ()=>{}} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 48,
        borderRadius: 24,
        borderWidth:1,
        borderColor:Colors.CLR_E77C7E,
        backgroundColor: Colors.WHITE,
      }}
      key={`${Math.random()}`}
      onPress={() => {
        onSelected();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          color: Colors.CLR_414141,
          fontSize: 17,
          fontWeight: '700',
        }}>
        {title}
      </Text>
      <Icon
      style = {{position:'absolute', right:20}}
            name={CustomFonts.ChevronRight}
            size={20}
            color={Colors.APP_RED_SUBHEADING_COLOR}
          />
    </TouchableOpacity>
  );
};

export default OnlineEditInfo;
