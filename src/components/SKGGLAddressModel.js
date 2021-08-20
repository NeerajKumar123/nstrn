import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import {Google_Api_key} from '../constants/StaticValues';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const SKGGLAddressModel = props => {
  const {
    onSelectAddress,
    onClose,
    title = 'Select',
    keyLabel,
  } = props;
  const [listViewDisplayed, setListViewDisplayed] = useState(null);
  return (
    <Modal animationType='slide' transparent={false} visible={true}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          flexDirection: 'column',
          backgroundColor: '#00000080',
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            padding: 10,
            paddingBottom: 20,
            paddingTop: 44,
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderRadius: 8,
            overflow: 'hidden',
            shadowColor: Colors.LIGHTGRAY,
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowRadius: 3,
            shadowOpacity: 0.8,
            backgroundColor: Colors.WHITE,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'green',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => {
                onClose();
              }}>
              <Text
              style={{
                fontFamily: CustomFonts.OpenSansRegular,
                fontSize: 18,
                fontFamily:CustomFonts.OpenSansSemiBold,
                textAlign: 'center',
                color: Colors.APP_RED_SUBHEADING_COLOR,
                textAlign: 'center',
                width: '100%',
              }}>
              Cancel
            </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 50,
              marginTop:40,
              zIndex: 1000,
            }}>
            <GooglePlacesAutocomplete
              currentLocation={false}
              keepResultsAfterBlur = {true}
              currentLocationLabel={'Current Location'}
              enableHighAccuracyLocation={true}
              placeholder="Search for a address"
              minLength={3} // minimum length of text to search
              autoFocus={true}
              returnKeyType={'search'}
              listViewDisplayed={listViewDisplayed}
              fetchDetails={false}
              renderDescription={row => row.description}
              enablePoweredByContainer={true}
              listUnderlayColor="lightgrey"
              renderRow={(rowData) => {
                const title = rowData.structured_formatting.main_text;
                const address = rowData.structured_formatting.secondary_text;
                return (
                 <View>
                  <Text style={{ fontSize: 14 }}>{title}</Text>
                  <Text style={{ fontSize: 14 }}>{address}</Text>
                 </View>
                 );
                }}    
              onPress={(data, details) => {
                console.log('details', details);
                console.log('data', data);
                setListViewDisplayed(null);
                onSelectAddress(data.description);
                console.log('details.description', data.description);
              }}
              textInputProps={{
                onChangeText: text => {
                  console.log('text==>', text);
                  setListViewDisplayed('auto');
                },
                style: {
                  fontSize: 15,
                  width: '100%',
                  height: 50,
                  padding: 3,
                  paddingHorizontal: 20,
                  borderColor: Colors.GRAY,
                  borderRadius: 6,
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
                key: Google_Api_key,
                language: 'en', // language of the results
                components: 'country:can',
              }}
              styles={{
                description: {
                  color: Colors.BLACK,
                  fontSize: 15,
                  backgroundColor:'red'
                },
                predefinedPlacesDescription: {
                  color: Colors.BLACK,
                },
                listView: {
                  position: 'absolute',
                  marginTop: 60,
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
        </View>
      </View>
    </Modal>
  );
};

export default SKGGLAddressModel;
