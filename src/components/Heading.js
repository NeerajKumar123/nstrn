import React from 'react';
import {Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs';
const Heading = props => {
  const {
    color = Colors.APP_RED_SUBHEADING_COLOR,
    fontSize = 25,
    fontWeight = '700',
    value = 'Heading',
    status = 0,
    fontFamily = CustomFonts.OpenSansRegular,
    textAlign = 'left',
    onClicked = undefined,
    textWidth = undefined,
  } = props;
  let statusImage = CustomFonts.status_gray;
  if (status === 1) {
    // all set
    statusImage = CustomFonts.green_tick;
  } else if (status === 2) {
    statusImage = CustomFonts.red_cross;
  }
  return (
    <TouchableOpacity
      disabled={!onClicked}
      style={styles.container}
      onPress={() => {
        onClicked && onClicked();
      }}>
      <Text
        style={{
          color,
          fontSize,
          fontWeight,
          fontFamily,
          textAlign,
          width: textWidth && textWidth,
        }}>
        {value}
      </Text>
      {status ? (
        <Image resizeMode="contain" style={styles.image} source={statusImage} />
      ) : null}
    </TouchableOpacity>
  );
};

export default Heading;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    width: '100%',
    alignItems: 'center',
  },
  image: {width: 20, height: 20},
});
