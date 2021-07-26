import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Heading from '../components/Heading';
import AppHeader from '../components/AppHeader';
import SKButton from '../components/SKButton';
import * as CustomFonts from '../constants/FontsDefs';
import * as Colors from '../constants/ColorDefs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserDocuments, deleteDocument} from '../apihelper/Api';
import DocumentViewer from '../components/DocumentViewer';
import SKLoader from '../components/SKLoader';

const ManageDocuments = props => {
  const navigation = useNavigation();
  const [docs, setDocs] = useState();
  const [showDoc, setShowDoc] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    setIsLoading(true)
    const userid = global.userInfo?.user_id;
    const taxFileID = global.userInfo?.Tax_File_Id;
    const params = {User_Id: userid, Tax_File_Id: taxFileID || 83};
    getUserDocuments(params, docsRes => {
      setIsLoading(false)
      console.log('docsRes', docsRes);
      if (docsRes?.status == 1) {
        setDocs(docsRes.data);
      } else {
        Alert.alert('SukhTax', 'Something went wrong.');
      }
    });
  };

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}>
      <AppHeader navigation={navigation} />
      {isLoading && <SKLoader/>}
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}>
        <Heading value="MANAGE DOCUMENTS" marginTop={60} />
        <Heading
          fontSize={20}
          marginTop={5}
          color={Colors.CLR_D9272A}
          value="SEE BELOW FOR ALL DOCUMENTS UPLOADED"
        />
        {docs &&
          docs.map((item, index) => {
            return (
              <ManageDocCard
                item={item}
                onOpen={() => {
                  console.log('opening', item);
                  setSelectedItem(item);
                  setShowDoc(true);
                }}
                onDelete={() => {
                  console.log('deleting', item);
                  const options = [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log('Cancel');
                      },
                    },
                    {
                      text: 'Delete',
                      onPress: () => {
                        const userid = global.userInfo?.user_id;
                        const taxFileID = global.userInfo?.Tax_File_Id;
                        const params = {
                          User_Id: userid,
                          Tax_File_Id: taxFileID || 83,
                          Tax_File_Document_Id: item.tax_file_document_id,
                        };
                        setIsLoading(true)
                        deleteDocument(params, delRes => {
                          console.log('delRes', delRes);
                          getDocs();
                        });
                      },
                    },
                  ];
                  Alert.alert(
                    'SukhTax',
                    'Are you sure you want to delete this document?',
                    options,
                  );
                }}
              />
            );
          })}
          {docs && docs.length > 0 && 
          <SKButton
          fontSize={16}
          marginTop={30}
          rightImage={CustomFonts.right_arrow}
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'AUTHORIZATION'}
          onPress={() => {
            console.log('link pressed');
            navigation.navigate('AuthorizerList');
          }}
        />
          }
        
        {showDoc && (
          <DocumentViewer
            onClose={() => setShowDoc(false)}
            item={selectedItem}
          />
        )}
      </ScrollView>
    </View>
  );
};

const ManageDocCard = props => {
  const {item, height = 44, fontSize = 15, onOpen, onDelete} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 15,
        paddingVertical: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
        minHeight: height,
        backgroundColor: Colors.WHITE,
        elevation: 2,
        backgroundColor: Colors.WHITE,
        shadowColor: Colors.LIGHTGRAY,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.8,
      }}>
      <TouchableOpacity
        onPress={() => {
          onOpen && onOpen();
        }}>
        <Text
          style={{
            textAlign: 'left',
            color: Colors.CLR_29295F,
            fontSize: fontSize,
            fontWeight: '500',
            fontFamily: CustomFonts.OpenSansRegular,
          }}>
          {item.document_file_name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onDelete && onDelete();
        }}>
        <Icon
          style={{marginRight: 0}}
          name={'close-circle-outline'}
          size={30}
          color={Colors.RED}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ManageDocuments;
