import axios from 'axios';
let baseURL = 'https://api.dota.fyi'
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

export const post = (url: any, data = {}) => {
  url = `${baseURL}${url}`
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}


export const get = (url: any, params = {}) => {
  url = `${baseURL}${url}`
  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}