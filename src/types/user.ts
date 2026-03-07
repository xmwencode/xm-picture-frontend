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


