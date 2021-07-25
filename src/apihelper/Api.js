import API from './BaseAPI';

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

export const saveSpouseInfo = (params,callback) => {
  const path = `${BaseURL}/Save_Spouse_Info`
  API.makePostRequest(path , params, callback);
};

export const onlineSaveMyYearInfo = (params,callback) => {
  const path = `${BaseURL}/Online_Save_My_Year_Info`
  API.makePostRequest(path , params, callback);
};








