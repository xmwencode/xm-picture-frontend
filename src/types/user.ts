import type { PageParams } from '@/types'

export interface User {
  id: string
  username: string
  nickname?: string
  role: number
  avatar?: string
  createTime: string
}

export interface UserLoginRequest {
  username: string
  password: string
}

export interface UserRegisterRequest {
  username: string
  password: string
  checkPassword: string
}

export interface UserLoginVO {
  token: string
  userDTO?: User
}

export interface UserAddRequest {
  username: string
  password: string
  role: number
  nickname?: string
  avatar?: string
}

export interface UserUpdateRequest {
  id: string
  username: string
  nickname?: string
  avatar?: string
  role: number
}

export interface UserEditRequest {
  nickname?: string
  avatar?: string
  password?: string
}

export interface UserQueryRequest extends PageParams{
  id?: string
  username?: string
  nickname?: string
  role?: number
  startTime?: string
  endTime?: string
}

