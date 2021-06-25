import API from './BaseAPI';
//test comment

export const testApi = (params,callback) => {
  const path = `apipath`
  API.makeGetRequest(path, res =>{
    console.log('apipath',res)
    callback(res)
  });
};

export const sendOtp = (params,callback) => {
  const path = `apipath`
  API.makeGetRequest(path,callback);
};

export const verifyOtp = (params,callback) => {
  const path = `apipath`
  API.makePostRequest(path , params, callback);
};


