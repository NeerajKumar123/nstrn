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





