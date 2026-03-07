<script setup lang="ts">

import type { UserLoginRequest } from '@/types'
import { userLoginApi } from '@/api'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import { reactive } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const formData = reactive<UserLoginRequest>({
  username: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    const res = await userLoginApi(formData)
    userStore.setToken(res.data?.token ?? '')
    userStore.setUserInfo(res.data?.userDTO ?? userStore.loginUser)
    console.log(res)
    message.success('登录成功')
    await router.push('/')
  } catch (e) {
    message.error('登录失败')
  }
}

</script>

<template>
  <div id="user-login-page">
    <h2 class="title">浔梦智能云图库 - 用户登录</h2>
    <div class="desc">你想找的这里都有</div>

    <!--  登录表单  -->
    <a-form
      :model="formData"
      name="normal_login"
      autocomplete="off"
      @finish="handleSubmit"
      :validate-trigger="['blur']"
      style="width: 400px"
    >
      <a-form-item
        name="username"
        :rules="[
          { required: true, message: '请输入用户名'},
          { min: 4, max: 12, message: '用户名长度在4到12个字符之间!' },
        ]"
      >
        <a-input v-model:value="formData.username" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[
          { required: true, message: '请输入密码'},
          { min: 6, max: 16, message: '密码长度在6到16个字符之间!' },
        ]"
      >
        <a-input-password v-model:value="formData.password" placeholder="请输入密码" />
      </a-form-item>

      <div class="tips">
        没有账号？
        <router-link to="/user/register">点击注册</router-link>
      </div>

      <a-form-item>
        <a-button style="width: 100%;" type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#user-login-page {
  max-width: 480px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
  margin-top: 60px;
}

.desc {
  text-align: center;
  color: #bbbbbb;
  margin-bottom: 16px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>
