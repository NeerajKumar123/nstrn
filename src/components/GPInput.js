import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import {Google_Api_key} from '../constants/StaticValues'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GPInput = props => {
  const {onSelectAddress, address} = props;
  const [listViewDisplayed, setListViewDisplayed] = useState(null);

  return (
    <View
      style={{
        height: 60,
        zIndex: 1000,
        marginTop: 20,
      }}>
      <GooglePlacesAutocomplete
        currentLocation={false}
        numberOfLines={2}
        currentLocationLabel={'Current Location'}
        enableHighAccuracyLocation={true}
        placeholder="Search for a address"
        minLength={3} // minimum length of text to search
        autoFocus={false}
        returnKeyType={'search'}
        listViewDisplayed={listViewDisplayed}
        fetchDetails={true}
        renderDescription={row => row.description}
        enablePoweredByContainer={true}
        listUnderlayColor="lightgrey"
        onPress={(data, details) => {
          setListViewDisplayed(null);
          onSelectAddress(data.description);
        }}
        textInputProps={{
          onChangeText: text => {
            setListViewDisplayed('auto');
          },
          style: {
            fontSize: 15,
            width: '100%',
            height: 60,
            padding: 3,
            paddingHorizontal: 20,
            borderColor: Colors.GRAY,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 2,
            backgroundColor: Colors.WHITE,
            shadowColor: Colors.LIGHTGRAY,
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowRadius: 3,
            shadowOpacity: 0.8,
          },
        }}
        getDefaultValue={() => {
          return address; // text input default value
        }}
        query={{
          key: {Google_Api_key},
          language: 'en', // language of the results
          components: 'country:can',
        }}
        styles={{
          description: {
            color: Colors.BLACK,
            fontSize: 15,
          },
          predefinedPlacesDescription: {
            color: Colors.BLACK,
          },
          listView: {
            position: 'absolute',
            marginTop: 44,
            backgroundColor: Colors.WHITE,
            borderBottomEndRadius: 15,
            elevation: 2,
          },
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        GooglePlacesSearchQuery={{
          rankby: 'distance',
          types: 'building',
        }}
        filterReverseGeocodingByTypes={[
          'locality',
          'administrative_area_level_3',
        ]}
        debounce={200}
      />
    </View>
  );
};

export default GPInput;
