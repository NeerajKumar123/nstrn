import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import DateTimePicker from '@react-native-community/datetimepicker';
const {width} = Dimensions.get('window');

const SKDatePicker = props => {
  const {
    onCancelPressed = () => {},
    onDonePressed = () => {},
    originalDate = new Date(),
    title = 'Select Date',
    maximumDate = new Date()
  } = props;

  const [selectedDate, setSelectedDate] = useState(originalDate);

  return (
    <View
      style={{
        backgroundColor: Colors.CLR_EEEEEE,
        position: 'absolute',
        bottom: 0,
        height: Platform.OS == 'ios' ? 256 : 0,
        width: width,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height:50,
          paddingHorizontal:10,
          alignItems:'center',
        }}>
        <TouchableOpacity
          style={{
            borderRadius: 6,
            borderColor: Colors.APP_RED_SUBHEADING_COLOR,
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          onPress={() => {
            onCancelPressed(originalDate);
          }}>
          <Text
            style={{
              color: Colors.APP_RED_SUBHEADING_COLOR,
              fontSize: 14,
              fontWeight: '500',
            }}>
            CANCEL
          </Text>
        </TouchableOpacity>
        <Text
            style={{
              color: Colors.BLACK,
              fontSize: 15,
              fontWeight: '500',
            }}>
            {title.toUpperCase()}
          </Text>
        <TouchableOpacity
          style={{
            borderRadius: 6,
            borderColor: Colors.APP_BLUE_HEADING_COLOR,
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          onPress={() => {
            onDonePressed(selectedDate);
          }}>
          <Text
            style={{
              color: Colors.APP_BLUE_HEADING_COLOR,
              fontSize: 14,
              fontWeight: '500',
            }}>
            DONE
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePicker
        style={{backgroundColor: 'white'}}
        testID="dateTimePicker"
        value={selectedDate}
        maximumDate = {maximumDate}
        mode="date"
        display={Platform.OS == 'ios' ? 'spinner' : 'spinner'}
        onChange={(event, date) => {
          console.log('event',event)
          if (event?.type != 'dismissed') {
            Platform.OS == 'ios' ? setSelectedDate(date) : onDonePressed(date);
          }else{
            Platform.OS == 'ios' ? setSelectedDate(date) : onCancelPressed(originalDate);
          }
        }}
      />
    </View>
  );
};

export default SKDatePicker;

const styles = StyleSheet.create({
  textInputUnderLined: {
    fontSize: 16,
    height: 30,
    fontSize: 16,
    width: '60%',
  },
  lottie: {
    width: 40,
    height: 40,
  },
});
