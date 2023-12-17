import axios from 'axios';
let baseURL = 'http://47.242.70.156:6666'
axios.defaults.timeout = 100000;

axios.interceptors.request.use((config: any) => {
  config.headers = {
    'content-type': 'application/json;charset=UTF-8'
  }
  return config;
}, error => {
    return Promise.reject(error);
  }
)

axios.interceptors.response.use(response => {
  return response
}, err => {
  return Promise.reject(err)
})


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export const post = (url, data = {}) => {
  url = `${baseURL}${url}`
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}


export const get = (url, params = {}) => {
  url = `${baseURL}${url}`
  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}