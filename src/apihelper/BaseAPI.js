import axios from 'axios';
import { Alert } from 'react-native';
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const API = {
  makeGetRequest(path, callback) {
    console.log('Getting ===>', path);
    axios
      .get(path)
      .then(res => {
        const resData = res && res.data;
        callback && callback(resData);
      })
      .catch(error => {
        extractError(error);
        callback && callback({status:0});
      });
  },

  makePostRequest(path, params, callback) {
    console.log('Posting ===>', path, JSON.stringify(params));
    const urlEncodedParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      urlEncodedParams.append(key, params[key]);
    });
    axios({
      method: 'post',
      url: path,
      data: urlEncodedParams,
      config,
    })
      .then(res => {
        const resData = res && res.data;
        console.log('Response=====>',path, JSON.stringify(resData))
        callback && callback(resData);
      })
      .catch(error => {
        extractError(error, path);
        callback && callback({status:0});
      });
  },
};

const extractError = (error, url) => {
  // Error 😨
  if (error.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    console.log('Erroring Url ===>',url);
    console.log('error.response.data', error.response.data);
    console.log('error.response.status',error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    console.log('error.request', error.request);
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log('error.message', error.message);
  }
  console.log('error.config', error.config);
};

export default API;
