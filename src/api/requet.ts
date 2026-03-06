import axios from 'axios'
import { ApiSuccessCode } from '@/types'

// 区分开发环境与生产环境
const DEV_BASE_URL = 'http://localhost:18080/api'
const PROD_BASE_URL = 'http://localhost:18080/api'

const request = axios.create({
  baseURL: DEV_BASE_URL,
  timeout: 60 * 1000,
  withCredentials: true,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    if (res.data.code === ApiSuccessCode) {
      return res.data
    }
    // 请求失败
    return Promise.reject(res)
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
