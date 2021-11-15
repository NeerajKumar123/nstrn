import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
const RNFS = require('react-native-fs');

export default PDFExample = () => {
  const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        minScale={1.0}
  maxScale={1.0}
  scale={1.0}
  spacing={0}
  fitPolicy={0}
  enablePaging={true}
  onPageSingleTap={(page, x, y) => {
    console.log(`tap: ${page}`);
    console.log(`x: ${x}`);
    console.log(`y: ${y}`);
  }}
        onLoadComplete={(numberOfPages,filePath, {width, height})=>{
            console.log(`number of pages: ${numberOfPages}`);
            console.log(`width: ${width}`);
            console.log(`height: ${height}`);
        }}
        onPageChanged={(page,numberOfPages)=>{
            console.log(`current page: ${page}`);
        }}
        onError={(error)=>{
            console.log(error);
        }}
        onPressLink={(uri)=>{
            console.log(`Link presse: ${uri}`)
        }}
        style={styles.pdf}/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#f4f4f4'
  },
  pdf: {
    width:Dimensions.get('window').width,
    height: Dimensions.get('window'). height,
  }
});