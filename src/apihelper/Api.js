import API from './BaseAPI';

// test commit

const BaseURL = 'http://sukhtax.newunlimitedhosting.21gtech.com/services.asmx'

export const register = (params,callback) => {
  const path = `${BaseURL}/User_Register`
  API.makePostRequest(path , params, callback);
};

export const login = (params,callback) => {
  const path = `${BaseURL}/Login`
  API.makePostRequest(path , params, callback);
};

export const forgotPassword = (params,callback) => {
  const path = `${BaseURL}/ForgetPassword`
  API.makePostRequest(path , params, callback);
};

export const resetPassword = (params,callback) => {
  const path = `${BaseURL}/ResetPassword`
  API.makePostRequest(path , params, callback);
};
export const userCheckOtpForLogin = (params,callback) => {
  const path = `${BaseURL}/User_Check_OTP_For_Login`
  API.makePostRequest(path , params, callback);
};

export const changePassword = (params,callback) => {
  const path = `${BaseURL}/ChangePassword`
  API.makePostRequest(path , params, callback);
};

export const sendOtp = (params,callback) => {
  const path = `apipath`
  API.makeGetRequest(path,callback);
};

export const verifyOtp = (params,callback) => {
  const path = `${BaseURL}/Update_User_Profile`
  API.makePostRequest(path , params, callback);
};

export const updateUserProfile = (params,callback) => {
  const path = `${BaseURL}/Update_User_Profile`
  API.makePostRequest(path , params, callback);
};
export const getUserProfileDetails = (params,callback) => {
  const path = `${BaseURL}/Get_User_Profile_Details`
  API.makePostRequest(path , params, callback);
};

export const getMessages = (params,callback) => {
  const path = `${BaseURL}/Message_Get_Messages`
  API.makePostRequest(path , params, callback);
};

export const saveMessage = (params,callback) => {
  const path = `${BaseURL}/Message_Save_Message`
  API.makePostRequest(path , params, callback);
};

export const uploadImage = (params,callback) => {
  const path = `${BaseURL}/Online_Upload_Identification_Document_Base64`
  API.makePostRequest(path , params, callback);
};

export const getActiveFileStatusOnLogin = (params,callback) => {
  const path = `${BaseURL}/GetActiveFileStatusOnLogin`
  API.makePostRequest(path , params, callback);
};

export const getAboutInfo = (params,callback) => {
  const path = `${BaseURL}/Get_About_Info`
  API.makePostRequest(path , params, callback);
};

export const saveAboutInfo = (params,callback) => {
  const path = `${BaseURL}/Save_About_Info`
  API.makePostRequest(path , params, callback);
};

export const getCanadaProvinceList = (params,callback) => {
  const path = `${BaseURL}/GetCanadaProvinceList`
  API.makePostRequest(path , params, callback);
};

export const getInstitutionList = (params,callback) => {
  const path = `${BaseURL}/GetInstitutionList`
  API.makePostRequest(path , params, callback);
};

export const getBankingAndFamilyInfo = (params,callback) => {
  const path = `${BaseURL}/Get_Banking_And_Family_Info`
  API.makePostRequest(path , params, callback);
};

export const getResidencyList = (params,callback) => {
  const path = `${BaseURL}/GetResidencyList`
  API.makePostRequest(path , params, callback);
};

export const getMaritalStatusList = (params,callback) => {
  const path = `${BaseURL}/GetMaritalStatusList`
  API.makePostRequest(path , params, callback);
};

export const saveBankingAndFamilyInfoByYear = (params,callback) => {
  const path = `${BaseURL}/Save_Banking_and_Family_Info_By_Year`
  API.makePostRequest(path , params, callback);
};

export const updateBankingAndFamilyInfoByYear = (params,callback) => {
  const path = `${BaseURL}/Update_Banking_and_Family_Info_By_Year`
  API.makePostRequest(path , params, callback);
};
export const saveSpouseInfo = (params,callback) => {
  const path = `${BaseURL}/Save_Spouse_Info`
  API.makePostRequest(path , params, callback);
};

export const onlineSaveMyYearInfo = (params,callback) => {
  const path = `${BaseURL}/Online_Save_My_Year_Info`
  API.makePostRequest(path , params, callback);
};

export const uploadDocumentBS64 = (params,callback) => {
  const path = `${BaseURL}/Upload_Document_Base64`
  API.makePostRequest(path , params, callback);
};

export const getUserDocuments = (params,callback) => {
  const path = `${BaseURL}/Get_User_Documents`
  API.makePostRequest(path , params, callback);
};

export const finalizeOnlineProcess = (params,callback) => {
  const path = `${BaseURL}/Finalize_Online_Process`
  API.makePostRequest(path , params, callback);
};
export const deleteDocument = (params,callback) => {
  const path = `${BaseURL}/Delete_Document`
  API.makePostRequest(path , params, callback);
};

export const onlineUploadAuthrizationDocumentBS64 = (params,callback) => {
  const path = `${BaseURL}/Online_Upload_Authorization_Document_Base64`
  API.makePostRequest(path , params, callback);
};

export const onlineSaveDependentInfo = (params,callback) => {
  const path = `${BaseURL}/Online_Save_Dependent_Info`
  API.makePostRequest(path , params, callback);
};
export const onlineUpdateDependentInfo = (params,callback) => {
  const path = `${BaseURL}/Online_Update_Dependent_Info`
  API.makePostRequest(path , params, callback);
};

export const getTaxReturnsDocs = (params,callback) => {
  const path = `${BaseURL}/Documents_Get_Tax_Returns_Documents`
  API.makePostRequest(path , params, callback);
};

export const getIncorporationDocs = (params,callback) => {
  const path = `${BaseURL}/Documents_Get_Incorporation_Documents`
  API.makePostRequest(path , params, callback);
};

export const getT1GeneralDocs = (params,callback) => {
  const path = `${BaseURL}/Documents_Get_Tax_Docs_Documents`
  API.makePostRequest(path , params, callback);
};

export const getCRALattersDocs = (params,callback) => {
  const path = `${BaseURL}/Documents_Get_CRA_Letters_Documents`
  API.makePostRequest(path , params, callback);
};


export const getOnlinePaymentDetails = (params,callback) => {
  const path = `${BaseURL}/Online_Get_Payment_Details`
  API.makePostRequest(path , params, callback);
};


export const onlineSubmitFiling = (params,callback) => {
  const path = `${BaseURL}/Online_Submit_For_Filing`
  API.makePostRequest(path , params, callback);
};

export const stripeGenerateEphemeralKey = (params,callback) => {
  const path = `${BaseURL}/Stripe_Generate_Ephemeral_Key`
  API.makePostRequest(path , params, callback);
};

export const stripeSubmitPayment = (params,callback) => {
  const path = `${BaseURL}/Stripe_Submit_Payment`
  API.makePostRequest(path , params, callback);
};

export const onlineSavePaymentInfo = (params,callback) => {
  const path = `${BaseURL}/Online_Save_Payment_Info`
  API.makePostRequest(path , params, callback);
};
export const onlineSaveAdditionalPaymentInfo = (params,callback) => {
  const path = `${BaseURL}/Online_Save_Additional_Payment_Info`
  API.makePostRequest(path , params, callback);
};

export const getServicePriceList = (callback) => {
  const path = `${BaseURL}/Get_Service_PriceList`
  API.makeGetRequest(path , callback);
};


// Incorp.....
export const incorpGetIncorpType = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Get_Incorporation_Type`
  API.makePostRequest(path , params, callback);
};

export const incorpGetIncorpCategory = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Get_Incorporation_Category`
  API.makePostRequest(path , params, callback);
};

export const incorpRegisterCorp = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Register_Corporation`
  API.makePostRequest(path , params, callback);
};

export const incorpGetNatureOfBussiness = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Get_Nature_Of_Business`
  API.makePostRequest(path , params, callback);
};

export const incorpUploadImage = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Upload_Identification_Document_Base64`
  API.makePostRequest(path , params, callback);
};

export const incorpSaveIncorporatorDetails = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Save_Incorporator_Detail`
  API.makePostRequest(path , params, callback);
};

export const incorpGetIncorporatorList = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Get_Incorporator_List`
  API.makePostRequest(path , params, callback);
};

export const incorpGetIncorporatorDetails = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Get_Incorporator_Details`
  API.makePostRequest(path , params, callback);
};

export const incorpUpdateIncorporatorDetails = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Update_Incorporator_Detail`
  API.makePostRequest(path , params, callback);
};

export const incorpSaveAboutCorp = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Save_About_Corporation`
  API.makePostRequest(path , params, callback);
};
export const incorpUploadAuthImage = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Upload_Authorization_Document_Base64`
  API.makePostRequest(path , params, callback);
};
export const incorpSaveHSTRegistration = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Save_HST_Registration`
  API.makePostRequest(path , params, callback);
};

export const incorpGetPaymentDetails = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Get_Payment_Details`
  API.makePostRequest(path , params, callback);
};

export const incorpGetEphemeralKey = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Generate_Ephemeral_Key`
  API.makePostRequest(path , params, callback);
};
export const incorpSubmitPayment = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Submit_Payment`
  API.makePostRequest(path , params, callback);
};
export const incorpSavePaymentInfo = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Save_Payment_Info`
  API.makePostRequest(path , params, callback);
};

export const incorpGetIncorpStatus = (params,callback) => {
  const path = `${BaseURL}/Incorporation_Get_Incorporation_Status`
  API.makePostRequest(path , params, callback);
};




/// Request Docs

export const taxDocsGetTaxDocsType = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Get_Tax_Docs_Type`
  API.makePostRequest(path , params, callback);
};

export const taxDocsGenerateTaxDocId = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Generate_Tax_Docs_Id`
  API.makePostRequest(path , params, callback);
};

export const taxDocsSaveTypeAndYear = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Save_Type_And_Year`
  API.makePostRequest(path , params, callback);
};

export const taxDocsGetPaymentDetails = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Get_Payment_Details`
  API.makePostRequest(path , params, callback);
};

export const taxDocsGenerateEphemeralKey = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Generate_Ephemeral_Key`
  API.makePostRequest(path , params, callback);
};

export const taxDocsSubmitPayment = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Submit_Payment`
  API.makePostRequest(path , params, callback);
};

export const taxDocsSavePaymentInfo = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Save_Payment_Info`
  API.makePostRequest(path , params, callback);
};

export const taxDocsGetTaxDocsStatus = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Get_Status`
  API.makePostRequest(path , params, callback);
};

export const taxDocsFinalizeProcess = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Finalize_Process`
  API.makePostRequest(path , params, callback);
};

export const taxDocsGetReqDocs = (params,callback) => {
  const path = `${BaseURL}/Tax_Docs_Get_Requested_Documents`
  API.makePostRequest(path , params, callback);
};

export const craLattersGetStatus = (params,callback) => {
  const path = `${BaseURL}/CRA_Letters_Get_Status`
  API.makePostRequest(path , params, callback);
};
export const craLattersGetDetails = (params,callback) => {
  const path = `${BaseURL}/CRA_Letters_Get_Details`
  API.makePostRequest(path , params, callback);
};

export const craLattersSaveNewLetter = (params,callback) => {
  const path = `${BaseURL}/CRA_Letters_Save_new_Letter`
  API.makePostRequest(path , params, callback);
};

export const craLattersUploadLetterImage = (params,callback) => {
  const path = `${BaseURL}/CRA_Letters_Upload_Letter_Base_64`
  API.makePostRequest(path , params, callback);
};

export const craLattersFinalizeProcess = (params,callback) => {
  const path = `${BaseURL}/CRA_Letters_Finalize_Process`
  API.makePostRequest(path , params, callback);
};

export const updateDeviceIDAndOS = (params,callback) => {
  const path = `${BaseURL}/Update_DeviceId_DeviceOS`
  API.makePostRequest(path , params, callback);
};

//// Last year filed users.../.
export const onlineGetAboutInfoByYear = (params,callback) => {
  const path = `${BaseURL}/Online_Get_About_Info_By_User`
  API.makePostRequest(path , params, callback);
};
export const onlineGetBankingInfoByUser = (params,callback) => {
  const path = `${BaseURL}/Online_Get_Banking_And_Family_Info_By_User`
  API.makePostRequest(path , params, callback);
};


export const onlineGetSpouseInfoByUserId = (params,callback) => {
  const path = `${BaseURL}/Online_Get_Spouse_Info_By_User_Id`
  API.makePostRequest(path , params, callback);
};

export const onlineGetDependentInfoByUserId = (params,callback) => {
  const path = `${BaseURL}/Online_Get_Dependent_Info_By_User_Id`
  API.makePostRequest(path , params, callback);
};
