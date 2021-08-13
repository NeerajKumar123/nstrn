import React, {useState, useEffect} from 'react';
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
  uploadImage,
  getOnlinePaymentDetails,
  onlineSubmitFiling,
  getTaxReturnsDocs,
} from '../apihelper/Api';
import SKButton, {UploadDocButton} from '../components/SKButton';
import {useIsFocused} from '@react-navigation/native';
import {ImageQualityOptions} from '../constants/StaticValues'

const OnlineTaxFilingStatus = props => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

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

  const intiateImageUploading = res => {
    setIsLoading(true);
    const imgObj = res?.assets?.[0];
    if (!imgObj.base64) Alert.alert('SukhTax', 'Something went wrong!');
    const params = prepareParams(imgObj.base64);
    uploadImage(params, uploadRes => {
      setIsLoading(false);
      uploadRes?.message && Alert.alert('SukhTax', uploadRes?.message);
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
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          height: '100%',
          paddingBottom:Platform.OS == 'ios' ? 100 : 0
        }}>
        <Heading value={pageHeading()} marginTop={124} />
        <TaxFilingStatusCard
          navigation={navigation}
          marginTop={25}
          updateLoadingStatus={loadingStatus => {
            setIsLoading(loadingStatus);
          }}
          uploadClick={() => {
            console.log('onClicked');
            launchImageLibrary(ImageQualityOptions, res => {
              console.log('res', res);
              if (res?.didCancel) {
                console.log('didCancel');
              }
              if (res?.error) {
                console.log('error', res?.error ?? ERROR_MSG);
              }
              if (res?.assets) {
                intiateImageUploading(res);
              }
            });
          }}
        />
      </ScrollView>
    </View>
  );
};

const PaymentFinalCard = props => {
  const {details} = props;
  const totalAmount =
    (details &&
      details.reduce(function (sum, obj) {
        const updatedSum = sum + obj.amount;
        return updatedSum;
      }, 0)) ||
    0;
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
        value="BASED ON YOUR REQUIREMENTS, WE HAVE ASSESSED YOUR FEE TO "
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
        title={'PAYNOW'}
        onPress={() => {
          const nextPageParams = {payment_required:totalAmount,additional_payment_required:0}
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
  const {uploadClick, navigation, updateLoadingStatus} = props;
  const [paymentDetails, setPaymentDetails] = useState();
  const [isDetailsClicked, setIsDetailsClicked] = useState(false);
  const {
    tax_file_status_name = 'File not Submitted',
    status_description = 'Looks like you have to complete your registration and upload document still!',
    new_message_count = 0,
    can_edit_documents = 0,
    payment_required = 100,
    additional_payment_required = 20,
    book_now_url,
    spouse_info_filled,
    tax_file_status_id,
  } = global.onlineStatusData;

  const moveToPage = props => {
    const {
      years_selected = 0,
      identification_document_uploaded = 0,
      about_info_filled = 0,
      banking_family_info_filled = 0,
      dependent_info_filled = 0,
      spouse_info_filled = 0,
      my_year_info_filled = 0,
      document_uploaded = 0,
      authorization_document_uploaded = 0,
    } = global.onlineStatusData;
    if (authorization_document_uploaded) {
      navigation.navigate('AnyThingElse');
    } else if (document_uploaded) {
      navigation.navigate('AuthorizerList');
    } else if (my_year_info_filled) {
      navigation.navigate('OnlineDocuments');
    } else if (spouse_info_filled) {
      navigation.navigate('Dependents');
    } else if (dependent_info_filled) {
      navigation.navigate('MyTaxYear');
    } else if (banking_family_info_filled) {
      navigation.navigate('MyTaxYear');
    } else if (about_info_filled) {
      navigation.navigate('BankingAndMore');
    } else if (identification_document_uploaded) {
      navigation.navigate('BasicInfo');
    } else if (years_selected) {
      navigation.navigate('Identification');
    } else {
      navigation.navigate('OnlineReturnLanding');
    }
  };

  if (
    (tax_file_status_id == 10 || tax_file_status_id == 12) &&
    isDetailsClicked
  ) {
    return <PaymentFinalCard details={paymentDetails} />;
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
      {tax_file_status_id == 10 && (
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
      {tax_file_status_id == 12 && (
        <Heading
          fontSize={21}
          marginTop={20}
          fontWeight="700"
          color={Colors.APP_RED_SUBHEADING_COLOR}
          value={`ADDITIONAL PAYMENT : ${additional_payment_required}$`}
        />
      )}
      <Text
        style={{
          textAlign: 'left',
          color: Colors.BLACK,
          fontSize: 17,
          width: '100%',
          fontWeight: '400',
          marginTop: 30,
        }}>
        {status_description}
      </Text>
      {tax_file_status_id == 9 && (
        <UploadDocButton
          marginTop={35}
          title="UPLOAD THE DOC HERE"
          height={46}
          onClick={() => {
            uploadClick();
          }}
        />
      )}
      {tax_file_status_id == 16 && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.CLR_7F7F9F}
          borderColor={Colors.CLR_D3D3D9}
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

      {tax_file_status_id == 16  &&  (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
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
      <MessegesView
        count={new_message_count}
        onClick={() => {
          navigation.navigate('Messages');
        }}
      />
      {tax_file_status_id == 7 && can_edit_documents == 1 && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.SECONDARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'EDIT INFO'}
          onPress={() => {
            moveToPage();
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
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'RETURN TO HOME'}
          onPress={() => {
            navigation.popToTop();
          }}
        />
      )}
      {(tax_file_status_id == 9 || tax_file_status_id == 8) &&
        can_edit_documents == 1 && (
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
              title={'EDIT INFO'}
              onPress={() => {
                if (tax_file_status_id == 8) {
                  navigation.popToTop();
                } else {
                  moveToPage();
                }
              }}
            />
            <SKButton
              fontSize={16}
              width="48%"
              fontWeight={'normal'}
              backgroundColor={Colors.PRIMARY_FILL}
              borderColor={Colors.PRIMARY_BORDER}
              title={'Continue'}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        )}
      {tax_file_status_id == 14 && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}>
          <SKButton
            fontSize={16}
            width={spouse_info_filled ? '48%' : '100%'}
            rightImage={
              global.isFAuthorized
                ? CustomFonts.CheckRight
                : CustomFonts.ChevronRight
            }
            fontWeight={'normal'}
            backgroundColor={Colors.CLR_7F7F9F}
            borderColor={Colors.CLR_D3D3D9}
            title={spouse_info_filled ? 'TAXPAYER 1' : 'TAXPAYER'}
            onPress={() => {
              navigation.navigate('SignaturePage', {authIndex: 0});
            }}
          />
          {spouse_info_filled == 1 && (
            <SKButton
              fontSize={16}
              width="48%"
              rightImage={
                global.isSAuthorized
                  ? CustomFonts.CheckRight
                  : CustomFonts.ChevronRight
              }
              fontWeight={'normal'}
              backgroundColor={Colors.CLR_7F7F9F}
              borderColor={Colors.CLR_D3D3D9}
              title={'TAXPAYER 2'}
              onPress={() => {
                navigation.navigate('SignaturePage', {authIndex: 1});
              }}
            />
          )}
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
            const {user_id,tax_file_id} = global.onlineStatusData
            const params = {User_id: user_id, Tax_File_Id: tax_file_id};
            updateLoadingStatus(true);
            onlineSubmitFiling(params, submitFileRes => {
              updateLoadingStatus(false);
              if (submitFileRes?.status) {
                navigation.goBack();
              }
            });
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
          {console.log('tax_file_status_id', tax_file_status_id)}
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
      {(tax_file_status_id == 16 || tax_file_status_id == 0) && (
        <SKButton
          fontSize={16}
          marginTop={30}
          width="100%"
          fontWeight={'normal'}
          backgroundColor={Colors.PRIMARY_FILL}
          borderColor={Colors.PRIMARY_BORDER}
          title={'NEW FILING'}
          onPress={() => {
            navigation.popToTop();
          }}
        />
      )}
    </View>
  );
};

const MessegesView = props => {
  const {count} = props;
  return (
    <LinearGradient
      opacity={0.6}
      colors={[Colors.APP_RED_SUBHEADING_COLOR, Colors.CLR_D72528]}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 6,
        width: '100%',
        height: 90,
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
    </LinearGradient>
  );
};

export default OnlineTaxFilingStatus;
