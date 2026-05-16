import axios from 'axios'
import { ApiSuccessCode, TOKEN_NAME } from '@/types'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user.ts'

// 区分开发/生产环境（Vite用这个，Webpack把`import.meta.env`换成`process.env`）
const isDev = import.meta.env.MODE === 'development'

// 开发环境：直连本地后端，**不带/api**（开发环境不需要反向代理）
const DEV_BASE_URL = 'http://localhost:18080'
// 生产环境：相对路径 /api，自动继承页面的81端口 → http://101.200.0.15:81/api/...
const PROD_BASE_URL = '/api'

// 自动切换环境
const baseURL = isDev ? DEV_BASE_URL : PROD_BASE_URL

const request = axios.create({
  baseURL: baseURL,
  timeout: 60 * 1000,
  withCredentials: true,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 携带 token
    const loginUserStore = useUserStore()
    if (loginUserStore.token) {
      config.headers[TOKEN_NAME] = loginUserStore.token
    }
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
    } else {
      // 请求成功，但业务失败
      message.error(res.data.message ?? '请求失败')
    }
    // 请求失败
    return Promise.reject(res)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default request
