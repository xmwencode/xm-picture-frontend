import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { User } from '@/types'
import { getLoginUserApi } from '@/api'

export const useUserStore = defineStore('user', () => {

  const token = ref<string>(localStorage.getItem('token') || '')
  const loginUser = reactive<User>({
    id: '',
    username: '',
    nickname: '',
    role: -1,
    avatar: '',
    createTime: ''
  })

  const setToken = (newToken: string) => {
    if (newToken) {
      token.value = newToken
    }
    // 保存在本地
    localStorage.setItem('token', newToken)
  }

  const removeToken = () => {
    localStorage.removeItem('token')
  }

  const setUserInfo = (newUser: User | null) => {
    if (newUser) {
      Object.assign(loginUser, newUser)
    }
  }

  const removeUserInfo = () => {
    loginUser.id = ''
    loginUser.username = ''
    loginUser.avatar = ''
    loginUser.role = -1
    loginUser.nickname = ''
    loginUser.createTime = ''
  }

  const fetchLoginUser = async () => {
    try {
      const res = await getLoginUserApi()
      if (res.data) {
        setUserInfo(res.data)
      }
    } catch (e) {
      removeUserInfo()
      removeToken()
    }
  }

  return {
    token,
    loginUser,
    setToken,
    removeToken,
    fetchLoginUser,
    setUserInfo,
    removeUserInfo
  }
})
