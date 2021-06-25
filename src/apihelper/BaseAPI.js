import axios from 'axios';

const API = {
  makeGetRequest(path, callback) {
    console.log('makeGetRequest111', path)
    axios
      .get(path)
      .then(res => {
        console.log('makeGetRequest222', path, res.data)
        callback(res.data);
      })
      .catch(error => {
        console.log('error', error);
        callback({status: -1});
      });
  },

  makePostRequest(path, params, callback) {
    console.log('makePostRequest11', path, JSON.stringify(params))
    axios({
      method: 'post',
      url: path,
      data: params,
    })
      .then(res => {
        console.log('makePostRequest22', path,res.data)
        callback(res.data);
      })
      .catch(error => {
        console.log('error', error);
        callback({status: -1});
      });
  },
};

export default API;
