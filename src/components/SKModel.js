import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
import SKInput from '../components/SKInput';
import SKButton from '../components/SKButton';

const SKModel = props => {
  const {
    data = [{title: 'title'}, {title: 'title'}, {title: 'title'}],
    onSelect,
    onClose,
    title = 'Select',
    keyLabel,
  } = props;
  return (
    <Modal animationType="fade" transparent={false} visible={true}>
      <View
        onStartShouldSetResponder={() => onClose()}
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
            width: '90%',
            padding: 10,
            paddingBottom: 20,
            marginTop: 20,
            justifyContent: 'center',
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
            backgroundColor: 'white',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontFamily: CustomFonts.OpenSansRegular,
                fontSize: 15,
                textAlign: 'center',
                color: Colors.GRAY,
                textAlign: 'center',
                width: '100%',
              }}>
              {title}
            </Text>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => {
                onClose();
              }}>
              <Icon
                style={{marginRight: 0}}
                name={'close-circle-outline'}
                size={20}
                color={Colors.RED}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{width: '100%', marginTop: 20}}
            data={data}
            keyExtractor={(item, index) => 'key_' + index}
            renderItem={({item}) => (
              <Row
                item={item}
                keyLabel={keyLabel}
                onRowSelect={() => {
                  onSelect(item);
                }}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const Row = props => {
  const {item, keyLabel, onRowSelect} = props;
  const displayValue = (keyLabel && item[keyLabel]) || item;
  return (
    <TouchableOpacity
      style={{marginVertical: 10}}
      onPress={() => {
        onRowSelect();
      }}>
      <Text
        style={{
          fontFamily: CustomFonts.OpenSansRegular,
          fontSize: 20,
          textAlign: 'center',
        }}>
        {displayValue}
      </Text>
    </TouchableOpacity>
  );
};

export const SKModelImageTitle = props => {
  const {onTitleEntered = () => {}, onClose, title = 'Select'} = props;
  const [imageTitle, setImageTitle] = useState('');
  const [isError, setIsError] = useState(false);
  return (
    <Modal animationType="fade" transparent={false} visible={true}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          flexDirection: 'column',
          backgroundColor: '#00000070',
        }}>
        <View
          style={{
            width: '90%',
            padding: 10,
            paddingBottom: 20,
            marginTop: 20,
            justifyContent: 'center',
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
            backgroundColor: 'white',
          }}>
          <View
            style={{
              width: '100%',
              height: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => {
                onClose();
              }}>
              <Icon
                style={{marginRight: 0}}
                name={'close-circle-outline'}
                size={20}
                color={Colors.RED}
              />
            </TouchableOpacity>
          </View>
          <SKInput
            marginTop={20}
            marginBottom={0}
            maxLength={30}
            borderColor={Colors.CLR_0065FF}
            value={imageTitle}
            placeholder="Enter document title"
            onTextChange={value => {
              setImageTitle(value);
            }}
          />
          {isError && (
            <Text
              style={{
                color: Colors.APP_RED_SUBHEADING_COLOR,
                fontSize: 12,
                fontWeight: '500',
                width: '90%',
                marginTop: 8,
              }}>
              Please enter valid document title.
            </Text>
          )}
          <SKButton
            marginTop={30}
            fontSize={16}
            fontWeight={'normal'}
            width={'50%'}
            height={40}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'SUBMIT'}
            onPress={() => {
              if (imageTitle.length > 0) {
                onTitleEntered(imageTitle);
              } else {
                setIsError(true);
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export const CamActionSheet = props => {
  const {
    data = [
      {
        title: 'Library',
        id: 1,
        iconname: 'image-outline',
        iconcolor: 'skyblue',
      },
      {
        title: 'Camera',
        id: 2,
        iconname: 'camera-plus-outline',
        iconcolor: Colors.APP_BLUE_HEADING_COLOR,
      },
      {title: 'Cancel', id: 3},
    ],
    onSelect,
    onClose,
    title = 'Which one do you like?',
  } = props;
  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View
        onStartShouldSetResponder={() => onSelect({title: 'Cancel', id: 3})}
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#00000080',
        }}>
        <View
          style={{
            width: '100%',
            paddingBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            shadowColor: Colors.LIGHTGRAY,
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowRadius: 3,
            shadowOpacity: 0.8,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontFamily: CustomFonts.OpenSansRegular,
                fontSize: 15,
                textAlign: 'center',
                color: Colors.GRAY,
                textAlign: 'center',
                width: '100%',
              }}>
              {title}
            </Text>
          </View>
          <FlatList
            style={{width: '100%', marginTop: 20}}
            data={data}
            keyExtractor={(item, index) => 'key_' + index}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'red',
                  marginVertical: 2,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  onSelect(item);
                }}>
                <Text
                  style={{
                    fontFamily: CustomFonts.OpenSansRegular,
                    fontSize: 20,
                    color: item.id == 3 ? Colors.RED : Colors.WHITE,
                  }}>
                  {item.title}
                </Text>
                {item.iconname && (
                  <Icon
                    style={{marginLeft: 50}}
                    name={item.iconname}
                    size={25}
                    color={item.iconcolor}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SKModel;
