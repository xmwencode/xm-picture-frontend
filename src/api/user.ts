import type {
  ApiResponse,
  PageResult,
  User,
  UserAddRequest, UserEditRequest,
  UserLoginRequest,
  UserLoginVO,
  UserQueryRequest, UserUpdateRequest
} from '@/types'
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

export const addUserApi = (data: UserAddRequest): Promise<ApiResponse<String>> => {
  return request.post('/user/add', data)
}

export const updateUserApi = (data: UserUpdateRequest): Promise<ApiResponse<Boolean>> => {
  return request.post('/user/update', data)
}

export const editUserApi = (data: UserEditRequest): Promise<ApiResponse<Boolean>> => {
  return request.post('/user/edit', data)
}

export const deleteUserApi = (id: string): Promise<ApiResponse<Boolean>> => {
  return request.post('/user/delete', { id })
}

export const listUserByPageApi = (data: UserQueryRequest): Promise<ApiResponse<PageResult>> => {
  return request.post('/user/page', data)
}
