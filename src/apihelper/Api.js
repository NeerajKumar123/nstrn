import API from './BaseAPI';

export const testApi = (params,callback) => {
  const path = `apipath`
  API.makeGetRequest(params, path,callback);
};

export const sendOtp = (params,callback) => {
  const path = `apipath`
  API.makeGetRequest(path,callback);
};

export const verifyOtp = (params,callback) => {
  const path = `apipath`
  API.makePostRequest(path , params, callback);
};


