import React from  'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'


export const ST_REGEX = {
  FName: '^[a-zA-Z]{2,15}$',
  LName: '^[a-zA-Z]{2,15}$',
  FullName :'^[a-zA-Z]{2,30}(\\s){0,1}[a-zA-Z]{0,30}$',
  Email:'^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,4})$',
  Mobile: '^[0123456789]{1}[0-9]{9}$',
  Password: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,16}$',
  Address: '^[0-9a-zA-Zs,-]+$',
  BankAccount: '^d{5,10}$',
  BranchCode: '^d{5,8}$',
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
export const TIME_OPTIONS = ['FIRST TIME', '2020', '2019', '2018', '2017'];
export const YES_NO = [
  {id: 1, value: 'Yes'},
  {id: 0, value: 'No'},
];
export const RELATIONS = ['Father', 'Mother', 'Wife', 'Son', 'Daughter'];

export const ErrorStrings = {
  InvalidFName: 'Please enter valid first name.',
  InvalidLName: 'Please enter valid last name.',
  InvalidLName: 'Please enter valid last name.',
};

export const stripekey_test =
  'pk_test_51I8rlGBHi8nqbGSxAKVuVuxEit58oIMidFfbncCMy5GiAoDPoMIR2v9u87I29FOHcQ0ipuIyje0puIUpOPjSngqK00I7UTmxka';
export const stripekey_live =
  'pk_live_51I8rlGBHi8nqbGSxLUoRmQIMdKS2IupbsgiNJertoE7QEB0kHwQnBOepeKaE2Fgp6mSVOAIbPeByVHcK6Q3d8NjR00pN3scqwz';
export const stripeAccountId = 'acct_1I8rlGBHi8nqbGSx';
export const stripeAPIVersion = '2020-08-27';

export const Google_Api_key = 'AIzaSyDpdF27ZiuKLmsJXNfLyRbD-7nmlMa4tJw';

const width = 1200
const height = 1600
const quality = .7
// const width = 50
// const height = 50
// const quality = .2

export const LibImageQualityOptionsWithMultiSelectionSupport = {
  quality: quality,
  maxWidth: width,
  maxHeight: height,
  includeBase64: true,
  selectionLimit: 0,
};
export const LibImageQualityOptions = {
  quality: quality,
  maxWidth: width,
  maxHeight: height,
  includeBase64: true,
};

export const ImageActionSheetOptions = [

  <View style={{flexDirection: 'row'}}>
    <Text style={{fontFamily: CustomFonts.OpenSansRegular, fontSize: 20}}>
      Library
    </Text>
    <Icon
      style={{marginLeft: 50}}
      name={'image-outline'}
      size={25}
      color={'skyblue'}
    />
  </View>,
  
  <View style={{flexDirection: 'row'}}>
    <Text style={{fontFamily: CustomFonts.OpenSansRegular, fontSize: 20}}>
      Camera
    </Text>
    <Icon
      style={{marginLeft: 50}}
      name={'camera-plus-outline'}
      size={25}
      color={Colors.APP_BLUE_HEADING_COLOR}
    />
  </View>,
   <View style={{flexDirection: 'row', height:50, justifyContent:'center', alignItems:'center'}}>
    <Text
      style={{
        fontFamily: CustomFonts.OpenSansRegular,
        fontSize: 20,
        color: Colors.APP_RED_SUBHEADING_COLOR,
      }}>
      Cancel
    </Text>
  </View>,
  <View style={{flexDirection: 'row', height:30}}/>,
];

export const LocalInstsList = [{"residency_id":1,"residency_name":"Citizen","status":1,"added_on":"2020-12-10T06:47:04.197","added_by":1},{"residency_id":2,"residency_name":"Permanent Resident","status":1,"added_on":"2020-12-10T06:47:17.437","added_by":1},{"residency_id":3,"residency_name":"Work Permit","status":1,"added_on":"2020-12-10T06:47:30.667","added_by":1},{"residency_id":4,"residency_name":"Student Visa","status":1,"added_on":"2020-12-10T06:47:41.39","added_by":1},{"residency_id":6,"residency_name":"Other","status":1,"added_on":"2020-12-10T06:48:01.533","added_by":1}]
export const LocalResidencyList = [
  {
    "residency_id": 1,
    "residency_name": "Citizen",
    "status": 1,
    "added_on": "2020-12-10T06:47:04.197",
    "added_by": 1
  },
  {
    "residency_id": 2,
    "residency_name": "Permanent Resident",
    "status": 1,
    "added_on": "2020-12-10T06:47:17.437",
    "added_by": 1
  },
  {
    "residency_id": 3,
    "residency_name": "Work Permit",
    "status": 1,
    "added_on": "2020-12-10T06:47:30.667",
    "added_by": 1
  },
  {
    "residency_id": 4,
    "residency_name": "Student Visa",
    "status": 1,
    "added_on": "2020-12-10T06:47:41.39",
    "added_by": 1
  },
  {
    "residency_id": 6,
    "residency_name": "Other",
    "status": 1,
    "added_on": "2020-12-10T06:48:01.533",
    "added_by": 1
  }
]

export const LocalResidencyListSpouse = [
  {
    "residency_id": 1,
    "residency_name": "Citizen",
    "status": 1,
    "added_on": "2020-12-10T06:47:04.197",
    "added_by": 1
  },
  {
    "residency_id": 2,
    "residency_name": "Permanent Resident",
    "status": 1,
    "added_on": "2020-12-10T06:47:17.437",
    "added_by": 1
  },
  {
    "residency_id": 3,
    "residency_name": "Work Permit",
    "status": 1,
    "added_on": "2020-12-10T06:47:30.667",
    "added_by": 1
  },
  {
    "residency_id": 4,
    "residency_name": "Student Visa",
    "status": 1,
    "added_on": "2020-12-10T06:47:41.39",
    "added_by": 1
  },
  {
    "residency_id": 5,
    "residency_name": "Non-Resident",
    "status": 1,
    "added_on": "2020-12-10T06:47:51.553",
    "added_by": 1
  },
  {
    "residency_id": 6,
    "residency_name": "Other",
    "status": 1,
    "added_on": "2020-12-10T06:48:01.533",
    "added_by": 1
  }
]