import React from 'react';
import {TouchableOpacity, View, Image,Text,Button,StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as Colors from '../constants/ColorDefs';
import * as CustomFonts from '../constants/FontsDefs'

const RoyaltyInstruction = props => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom:10,
        width: '100%',
      }}>
      <AppHeader navigation={navigation}/>
      <View style={{ 
      width:'100%',  
      paddingHorizontal:20,
      alignItems:"center",
      }}>
        <Heading value="Sukh Tax Loyalty Program" fontSize = {18} marginTop={26} color = {Colors.APP_RED_SUBHEADING_COLOR}  />
        <Text 
        style={styles.blueText}>
        How does this work ?
        </Text> 
        <Text 
          style={styles.blueText}
        >
        Sukh Tax aims to make your experience as simple as possible.
        </Text> 
        <Text style={styles.blueText}>
        Our loyalty program is no different.
        </Text>
      <Text style={styles.blueText}>
      1) Sign up for our Loyalty Program
      </Text>
      <Text style={styles.blueText}>
      2) Refer a friend and give them your unique referral code</Text>
      <Text style={styles.blueText}>
      3) Your friend will save $5 at checkout of their Online Return, and you will receive $5</Text>
      <Text style={styles.blueText}>
      4) If you refer a friend for incorporation, your friend will save $15, and you will receive $15</Text>

      <SKButton
          marginTop = {30}
          fontSize={16}
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_EB0000}
          borderColor={Colors.PRIMARY_BORDER}
          title={'ENROLL NOW'}
          onPress={() => {
            navigation.navigate('RoyaltySubmit')
          }}
        />
      </View>
    </View>
  );
};

export default RoyaltyInstruction;


const styles = StyleSheet.create({
  blueText :{
    fontSize:17,
    color:Colors.APP_BLUE_HEADING_COLOR,
    width:'100%',
    fontWeight:'500',
    marginTop:16
  }
})
