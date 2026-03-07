import type { ApiResponse, User, UserLoginRequest, UserLoginVO } from '@/types'
import request from '@/api/requet.ts'

export const getLoginUserApi = (): Promise<ApiResponse<User>> => {
  return request.get('/user/info')
}

export const userLoginApi = (data: UserLoginRequest): Promise<ApiResponse<UserLoginVO>> => {
  return request.post('/user/login', data)
}

export const userRegisterApi = (data: UserLoginRequest): Promise<ApiResponse<Boolean>> => {
  return request.post('/user/register', data)
}

export const userLogoutApi = (): Promise<ApiResponse<Boolean>> => {
  return request.post('/user/logout')
}
