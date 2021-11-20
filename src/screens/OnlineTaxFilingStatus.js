import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  Platform,
  Linking
} from 'react-native';
import Heading from '../components/Heading';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import SKLoader from '../components/SKLoader';
import * as CustomFonts from '../constants/FontsDefs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as Colors from '../constants/ColorDefs';
import LinearGradient from 'react-native-linear-gradient';
import {
  uploadDocumentBS64,
  finalizeOnlineProcess,
  getOnlinePaymentDetails,
  onlineSubmitFiling,
  getTaxReturnsDocs,
  getConfirmationDocs,
  createEvenrSignDoc,
  EversingSuccess,
  EversingFailed
} from '../apihelper/Api';
import SKButton, {UploadDocButton,DarkBlueButton} from '../components/SKButton';
import {LibImageQualityOptions,ImageActionSheetOptions} from '../constants/StaticValues'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import * as SKTStorage from '../helpers/SKTStorage';
import {useIsFocused} from '@react-navigation/native';

const OnlineTaxFilingStatus = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const actionSheetRef = useRef()
  const [uploadImageCount, setUploadImageCount] = useState(0)
  const [confirmDocs, setConfirmDocs] = useState()
  const isFocused = useIsFocused();
  const pageHeading = () => {
    let title = 'ONLINE TAX FILING';
    const {tax_file_status_id} = global.onlineStatusData;
    if (tax_file_status_id == 10) {
      title = 'PAYMENTS';
    } else if (tax_file_status_id == 12) {
      title = 'ADDITIONAL PAYMENTS';
    }
    return title;
  };


  useEffect(() => {
    if(isFocused && global.onlineStatusData?.tax_file_status_id == 14){
      setIsLoading(true)
      const {user_id,tax_file_id} = global.onlineStatusData
      const params = {User_Id:user_id,Tax_File_Id:tax_file_id}
      getConfirmationDocs(params, (confDocs) =>{
        setIsLoading(false)
        if(confDocs?.status == 1){
          setConfirmDocs(confDocs.data)
        }
      })
    }
  }, [isFocused])
  
  const intiateImageUploading = res => {
    const imgObj = res?.assets?.[0];
    if (!imgObj.base64) Alert.alert('SukhTax', 'Something went wrong!');
    setIsLoading(true);
    const params = prepareParams(imgObj.base64);
    uploadDocumentBS64(params, uploadRes => {
      if(uploadRes?.status == 1){
        setUploadImageCount(uploadImageCount + 1) 
        setIsLoading(false);
        setTimeout(() => {
          uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message);
        }, 500);     
      }else{
        setIsLoading(false);
        setTimeout(() => {
          uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message);
        }, 500);  
      }
    });
  };

  const prepareParams = bs64Image => {
    const {user_id,tax_file_id} = global.onlineStatusData
    const params = {
      User_id: user_id,
      Tax_File_Id: tax_file_id,
      Year: parseInt('2020'),
      FileNameWithExtension: 'identification-document.jpg',
      Base64String: bs64Image,
    };
    return params;
  };

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
        style={{width: '100%', height:'100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100
        }}>
        <Heading value={pageHeading()} marginTop={40} />
        <TaxFilingStatusCard
          navigation={navigation}
          marginTop={25}
          confirmDocs = {confirmDocs}
          uploadImageCount  ={uploadImageCount}
          updateLoadingStatus={loadingStatus => {
            setIsLoading(loadingStatus);
          }}
          uploadClick={() => {
            actionSheetRef.current.show()
          }}
          onContinue = {()=>{
            const {user_id,tax_file_id} = global.onlineStatusData
            const params = {User_Id: user_id,Tax_File_Id: tax_file_id};
            setIsLoading(true)
            finalizeOnlineProcess(params,(finalizeRes) =>{
              if (finalizeRes?.status == 1) {
                setIsLoading(false)
                setTimeout(() => {
                  finalizeRes?.message && Alert.alert('SukhTax', finalizeRes?.message);
                  navigation.goBack()
                }, 350);
              }else{
                setIsLoading(false);
                setTimeout(() => {
                  finalizeRes?.message && Alert.alert('SukhTax', finalizeRes?.message);
                }, 300);      
              }
            })
          }}
        />
      </ScrollView>
      <ActionSheet
          ref={actionSheetRef}
          title={<Text style={{color: Colors.GRAY, fontSize: 18}}>Which one do you like?</Text>}
          options={ImageActionSheetOptions}
          onPress={(index) => {
            setTimeout(() => {
              if (index == 0) {
                launchImageLibrary(LibImageQualityOptions, res => {
                if (res?.didCancel) {
                  Alert.alert('SukhTax', 'Image uploading cancelled by user.')
                }else if (res?.error) {
                }else if(res?.assets){
                  intiateImageUploading(res)
                }
              });              
                }else if (index == 1) {
                launchCamera(LibImageQualityOptions, res => {
                if (res?.didCancel) {
                  Alert.alert('SukhTax', 'Image uploading cancelled by user.')
                }else if (res?.error) {
                }else if(res?.assets){
                  intiateImageUploading(res)
                }
              });
                }
            }, 100);
          }}
        />
    </View>
  );
};

const PaymentFinalCard = props => {
  const {details,navigation} = props;
  const totalAmount =
    (details &&
      details.reduce(function (sum, obj) {
        const updatedSum = sum + obj.amount;
        return updatedSum;
      }, 0)) ||
    0;
  const obj = details?.[0]  
  const isAddPyment = obj?.additional_payment
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: props.marginTop,
      }}
      onPress={() => {
        props.onClick && props.onClick();
      }}>
      <Heading
        fontSize={17}
        marginTop={12}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="BASED ON YOUR REQUIREMENTS, WE HAVE ASSESSED YOUR FEE TO BE:"
      />
      {details &&
        details.map((obj, index) => {
          return (
            <KeyValueView
              marginTop={20}
              title={obj.item_name}
              value={`$ ${obj.amount}`}
            />
          );
        })}
      <View
        style={{
          marginVertical: 20,
          height: 2,
          backgroundColor: Colors.CLR_00000020,
          width: '100%',
        }}
      />
      <KeyValueView title="TOTAL" value={`$ ${totalAmount}`} />
      <SKButton
        fontSize={16}
        marginTop={30}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.PRIMARY_BORDER}
        title={'PAY NOW'}
        onPress={() => {
          const nextPageParams = {payment_required:totalAmount,additional_payment_required:isAddPyment}
          navigation.navigate('OnlinePaymentScreen',{...nextPageParams})    
        }}
      />
    </View>
  );
};
const KeyValueView = props => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: props.marginTop,
      }}>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 20,
          color: Colors.APP_BLUE_HEADING_COLOR,
        }}>
        {props.title}
      </Text>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 20,
          color: Colors.APP_BLUE_HEADING_COLOR,
        }}>
        {props.value}
      </Text>
    </View>
  );
};

const TaxFilingStatusCard = props => {
  const {uploadClick, navigation, updateLoadingStatus = () => {},uploadImageCount = 0, onContinue,confirmDocs} = props;
  const [paymentDetails, setPaymentDetails] = useState();
  const [isDetailsClicked, setIsDetailsClicked] = useState(false);
  const {
    tax_file_status_name = 'File not Submitted',
    new_message_count = 0,
    can_edit_documents = 0,
    payment_required = 0,
    additional_payment_required = 0,
    book_now_url,
    spouse_info_filled,
    tax_file_status_id
  } = global.onlineStatusData;

  let status = global.onlineStatusData?.status_description
  status = status?.split('$').join('\n');
  const status_description = status || ''

  const getFile = (document) => {
    let file = {}
    file['name'] = document.title
    file["file_url"] = document.document_file_name
    file["file_id"] = document.tax_file_confirmation_id
    file["file_base64"] = ''
    return file
  }
  const signer = () => {
    const {email = 'rahbar.fatmi@21gfox.com'} = global.userInfo
    const user = global.userInfo
    const fName = user?.firstname ?? ''
    const lName = user?.lastname ?? ''
    const userFullName  = fName + ' ' + lName

    let signer = {}
    signer["id"] = 1
    signer['name'] = userFullName
    signer["email"] = email
    signer["pin"] = ''
    signer["message"] = ''
    signer["language"] = 'en'
    return signer
  }

  // const recipient = () => {
  //   let recipient = {}
  //   recipient["name"] = 'Rahber Fatmi'
  //   recipient["email"] = 'rahber.fatmi@21gfox.com'
  //   recipient["language"] = 'en'
  //   return recipient
  // }

  const field = (document) =>{
    let field = {}
    field["type"]  = 'signature'
    field["x"] = document.signature_x_coordinate
    field["y"] = document.signature_y_coordinate
    field["width"] = document.signature_width
    field["height"] = document.signature_height
    field["page"] = 1
    field["identifier"] = 'signature_1'
    field["required"] = 1
    field["readonly"] = 0
    field['signer'] = 1
    field['name'] = ''
    field["validation_type"] = ''
    field["text_size"] = ''
    field["text_font"] = ''
    field["text_font"] = ''
    field["text_style"] = ''
    field["value"] = ''
    field["options"] = []
    field["group"] = ''
    return field
  }


  const prepareParams = (document) =>{
    let params = {}
    params['sandbox'] = 1
    params["is_draft"] = 0
    params["embedded"] = 1
    params["title"] = 'Sukhtax Confirmation'
    params["message"] =  "This is my general document message."
    params["use_signer_order"] = 0
    params["reminders"] = 1
    params["require_all_signers"] = 1
    params["custom_requester_name"] = 'Sukhtax'
    params["custom_requester_email"] = 'sukhtaxit@gmail.com'
    params["redirect"] = EversingSuccess
    params["redirect_decline"] = EversingFailed
    params["client"] = ''
    params["expires"] = ''
    params["embedded_signing_enabled"] = 1
    params["flexible_signing"] = 0
    params["use_hidden_tags"] = 0
    params["files"] = [getFile(document)]
    params["signers"] = [signer()]
    // params["recipients"] = [recipient()]
    params["recipients"] = []
    params["fields"] = [[field(document)]]
    return params
  }

  const checkIfAllDocsSigned = () =>{
    console.log('checkIfAllDocsSigned', confirmDocs)
    const unsingedDocs = confirmDocs.filter(function(item) {
      return item?.eversign_document_hash == '' || item?.eversign_document_hash == null || item?.eversign_document_hash?.length < 1 ;
    });
    console.log('unsingedDocs?.length',unsingedDocs?.length)
    return unsingedDocs?.length > 0 ? false : true

  }

  if (
    (tax_file_status_id == 10 || tax_file_status_id == 12) &&
    isDetailsClicked
  ) {
    return <PaymentFinalCard details={paymentDetails} navigation = {navigation}/>;
  }
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: props.marginTop,
      }}>
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.APP_RED_SUBHEADING_COLOR}
        value="STATUS OF FILE :"
      />
      <Heading
        fontSize={20}
        fontWeight="700"
        color={Colors.APP_BLUE_HEADING_COLOR}
        value={tax_file_status_name}
        marginTop={2}
      />
      {tax_file_status_id == 10 && false && ( // Made change asbug filed....
        <Heading
          fontSize={21}
          marginTop={20}
          fontWeight="700"
          color={Colors.APP_BLUE_HEADING_COLOR}
          value={`TOTAL AMOUNT: ${
            payment_required + additional_payment_required
          }$`}
        />
      )}
      <Text
        style={{
          textAlign: 'left',
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 17,
          width: '100%',
          fontWeight: '700',
          marginTop: 30,
        }}>
        {status_description}
      </Text>
      {tax_file_status_id == 9  && (
        <UploadDocButton
          marginTop={35}
          title="UPLOAD THE DOC HERE"
          height={46}
          onClick={() => {
            uploadClick();
          }}
        />
      )}
      {tax_file_status_id == 9 && uploadImageCount ? <UploadedFilesStatus count={uploadImageCount} /> : null}
      {tax_file_status_id == 9 && uploadImageCount > 0 && (
        <SKButton
        fontSize={16}
        marginTop={30}
        width="100%"
        fontWeight={'normal'}
        backgroundColor={Colors.PRIMARY_FILL}
        borderColor={Colors.PRIMARY_BORDER}
        title={'SUBMIT UPLOADED DOCUMENTS'}
        onPress={() => {
          onContinue()
        }}
      />
      )}
      {tax_file_status_id == 9 &&
        <ManageDocButton
        grads={[Colors.APP_BLUE_HEADING_COLOR, Colors.APP_BLUE_HEADING_COLOR]}
        title="MANAGE DOCUMENTS"
        onClicked={() => {
          navigation.navigate('ManageDocuments', {isDocAdded:uploadImageCount, showFooterBtn:false});
        }}
      />
      }
      {tax_file_status_id == 16 && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'DOWNLOAD MY TAX DOCS'}
          onPress={() => {
            updateLoadingStatus(true);
            const {user_id} = global.onlineStatusData
            const params = {User_Id: user_id};
            getTaxReturnsDocs(params, taxReturnDocsRes => {
              updateLoadingStatus(false);
              if (taxReturnDocsRes?.data?.length) {
                navigation.navigate('HomeDocsListing', {
                  page_id: 1,
                  page_title: 'TAX RETURNS',
                  docs: taxReturnDocsRes?.data,
                });
              } else {
                Alert.alert('Sukhtax', 'There is no document.');
              }
            });
          }}
        />
      )}
      {tax_file_status_id == 16 && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.APP_BLUE_HEADING_COLOR}
          borderColor={Colors.CLR_D3D3D9}
          title={'NEW FILING'}
          onPress={() => {
            global.selectedYears = undefined
            global.isFAuthorized = undefined
            global.isSAuthorized  = undefined
            global.isFromSpouseFlow = undefined
            SKTStorage.setKeyValue('isFromSpouseFlow',undefined,()=>{})
            navigation.navigate('OnlineReturnLanding');
          }}
        />
      )}
      {tax_file_status_id == 13 && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'BOOK NOW'}
          onPress={() => {
            navigation.navigate('SKWebPage', {pageUrl: book_now_url});
          }}
        />
      )}
      {(tax_file_status_id == 13 ||
        tax_file_status_id == 15 ||
        tax_file_status_id == 16) && (
          <DarkBlueButton
          title={'RETURN TO DASHBOARD'}
          onClick={() => {
            navigation.popToTop();
          }}
        />
      )}
      {(tax_file_status_id == 9 || tax_file_status_id == 8) &&
        can_edit_documents == 1 && (
          <SKButton
          fontSize={16}
          marginTop = {18}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'EDIT INFO'}
          onPress={() => { 
            navigation.navigate('OnlineEditInfo')
          }}
        />
        )}
      {tax_file_status_id == 14 && confirmDocs?.length > 0 && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}>
            {confirmDocs.map((doc,index) =>{
              return(
                <SKButton
                fontSize={16}
                width={confirmDocs.length > 2 ?  '30%' :confirmDocs.length > 1 ? '48%' : '100%'}
                rightImage={ doc?.eversign_document_hash?.length > 0 ? CustomFonts.CheckRight: CustomFonts.ChevronRight}
                fontWeight={'normal'}
                backgroundColor={Colors.CLR_7F7F9F}
                borderColor={Colors.CLR_D3D3D9}
                title={doc?.title}
                onPress={() => {
                  if(doc?.eversign_document_hash?.length < 1){
                    const params = prepareParams(doc)
                    updateLoadingStatus(true)
                    createEvenrSignDoc(params, (res)=>{
                      updateLoadingStatus(false)
                      if(res?.signers && res?.signers?.length > 0){
                        const dochash = res?.document_hash
                        const signer = res?.signers?.[0]
                        const signingUrl = signer.embedded_signing_url
                        navigation.navigate('SKWebPage',{pageUrl:signingUrl, noOfDocs:confirmDocs?.length, currentIndex:index + 1,doc:doc, dochash:dochash})
                        }else{
                          Alert.alert('Sukhtax', 'Something went wrong, Please try again.')
                        }
                    })
                  }else{
                    Alert.alert('Sukhtax', 'Document is already signed.')
                  }
                }}
              />)
            })}
        </View>
      )}
      {tax_file_status_id == 14 && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'SUBMIT FOR FILING'}
          onPress={() => {
            if(checkIfAllDocsSigned()){
              const {user_id,tax_file_id} = global.onlineStatusData
              const params = {User_id: user_id, Tax_File_Id: tax_file_id};
              updateLoadingStatus(true);
              onlineSubmitFiling(params, submitFileRes => {
                updateLoadingStatus(false);
                if (submitFileRes?.status) {
                  navigation.goBack();
                }
              });
            }else{
              Alert.alert('Sukhtax', 'Please sign all the required documents.')
            }
          }}
        />
      )}
      {tax_file_status_id == 10 && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'DETAILS'}
            onPress={() => {
              const {user_id,tax_file_id} = global.onlineStatusData
              const params = {
                User_Id: user_id,
                Tax_File_Id: tax_file_id,
                Additional_Payment: additional_payment_required,
              };
              updateLoadingStatus(true);
              getOnlinePaymentDetails(params, paymentDetailsRes => {
                updateLoadingStatus(false);
                setIsDetailsClicked(true);
                if (paymentDetailsRes?.status) {
                  setPaymentDetails(paymentDetailsRes?.data);
                  setIsDetailsClicked(true);
                }
              });
            }}
          />
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'PAY SECURELY'}
            onPress={() => {
              const nextPageParams = {payment_required:payment_required,additional_payment_required:additional_payment_required}
              navigation.navigate('OnlinePaymentScreen',{...nextPageParams})    
            }}
          />
        </View>
      )}
      {tax_file_status_id == 12 && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}>
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.SECONDARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'DETAILS'}
            onPress={() => {
              const {user_id,tax_file_id} = global.onlineStatusData
              const params = {
                User_Id: user_id,
                Tax_File_Id: tax_file_id,
                Additional_Payment: additional_payment_required > 0 ? 1 : 0,
              };
              updateLoadingStatus(true);
              getOnlinePaymentDetails(params, paymentDetailsRes => {
                updateLoadingStatus(false);
                setIsDetailsClicked(true);
                if (paymentDetailsRes?.status) {
                  setPaymentDetails(paymentDetailsRes?.data);
                  setIsDetailsClicked(true);
                }
              });
            }}
          />
          <SKButton
            fontSize={16}
            width="48%"
            fontWeight={'normal'}
            backgroundColor={Colors.PRIMARY_FILL}
            borderColor={Colors.PRIMARY_BORDER}
            title={'PAY SECURELY'}
            onPress={() => {
              const nextPageParams = {payment_required:payment_required,additional_payment_required:additional_payment_required}
              navigation.navigate('OnlinePaymentScreen',{...nextPageParams})    
            }}
          />
        </View>
      )}
      <MessegesView
        count={new_message_count}
        onClick={() => {
          navigation.navigate('Messages');
        }}
      />
      {tax_file_status_id == 16  &&  (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="50%"
          fontWeight={'normal'}
          backgroundColor={Colors.SECONDARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'RATE US'}
          onPress={() => {
            //MOVE FOR RATING..
            const appLink = Platform.OS == 'ios' ? 'https://apps.apple.com/ca/app/sukh-tax/id1551644082' : 'https://play.google.com/store/apps/details?id=com.ushatek.sukhtax&hl=en_US&gl=US'
            Linking.canOpenURL(appLink).then(supported => {
              supported && Linking.openURL(appLink);
          }, (err) => console.log(err));      
          }}
        />
      )}
    </View>
  );
};

const MessegesView = props => {
  const {count} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 90,
        backgroundColor:Colors.PRIMARY_BORDER
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClick && props.onClick();
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            MESSAGES :
          </Text>
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: '700',
              marginTop: 5,
            }}>
            {`${count} NEW MESSAGES`}
          </Text>
        </View>
        <Image
          resizeMode="contain"
          style={{
            width: 42,
            height: 38,
          }}
          source={CustomFonts.messeges}
        />
      </TouchableOpacity>
    </View>
  );
};

const UploadedFilesStatus = props => {
  const {count} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        marginTop: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
      }}
      onPress={() => {
        props.onClicked && props.onClicked();
      }}>
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          fontFamily:CustomFonts.OpenSansRegular,
          color: Colors.APP_RED_SUBHEADING_COLOR,
          fontSize: 15,
        }}>
        {` Uploaded Documents : ${count}`}
      </Text>
    </TouchableOpacity>
  );
};

const ManageDocButton = props => {
  return (
    <LinearGradient
      opacity={0.8}
      colors={props.grads}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 56,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          props.onClicked && props.onClicked();
        }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 17,
            fontWeight: '700',
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OnlineTaxFilingStatus;
