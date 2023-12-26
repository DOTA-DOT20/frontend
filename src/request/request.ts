import axios, {AxiosRequestConfig, Method} from 'axios';
import { makeUseAxios, Options } from 'axios-hooks'


export const axiosInstance = axios.create({
  timeout: 100000,
  baseURL: 'https://api_test.dota.fyi',
})


axiosInstance.interceptors.request.use((config: any) => {
  config.headers = {
    'content-type': 'application/json;charset=UTF-8'
  }
  return config;
}, error => {
    return Promise.reject(error);
  }
)

axiosInstance.interceptors.response.use(response => {
  return response
}, err => {
  return Promise.reject(err)
})

export const useAxios = makeUseAxios({
  axios: axiosInstance,
  cache: false,
})

export const post = <T extends object>(url: string, data  = {} as T) => {
  return new Promise((resolve, reject) => {
    axiosInstance.post(url, data).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}

export const get = (url: string, params = {}) => {
  return new Promise((resolve, reject) => {
    axiosInstance.get(url, { params }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}
