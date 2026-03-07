<script setup lang="ts">
import type { UserRegisterRequest } from '@/types'
import { userRegisterApi } from '@/api'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()
const formData = reactive<UserRegisterRequest> ({
  username: '',
  password: '',
  checkPassword: '',
})

const handleSubmit = async () => {
  const res = await userRegisterApi(formData)
  if (res.data) {
    message.success('注册成功')
    // 跳转到登录页面
    await router.push('/user/login')
  } else {
    message.error('注册失败')
  }
}
</script>

<template>
  <div id="user-register-page">
    <h2 class="title">浔梦智能云图库 - 用户注册</h2>
    <div class="desc">你想找的这里都有</div>

    <!--  注册表单  -->
    <a-form
      :model="formData"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
      style="width: 400px"
    >
      <a-form-item
        name="username"
        :rules="[
          { required: true, message: '用户名不能为空!' },
          { min: 4, max: 12, message: '用户名长度在4到12个字符之间!' },
        ]"
      >
        <a-input v-model:value="formData.username" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[
          { required: true, message: '密码不能为空!' },
          { min: 6, max: 16, message: '密码长度在6到16个字符之间!' },
        ]"
      >
        <a-input-password v-model:value="formData.password" placeholder="请输入密码" />
      </a-form-item>

      <a-form-item
        name="checkPassword"
        :rules="[
          { required: true, message: '确认密码不能为空!' },
          { min: 6, max: 16, message: '密码长度在6到16个字符之间!' },
        ]"
      >
        <a-input-password v-model:value="formData.checkPassword" placeholder="请确认密码" />
      </a-form-item>

      <div class="tips">
        已有账号？
        <router-link to="/user/login">点击登录</router-link>
      </div>

      <a-form-item>
        <a-button @click="handleSubmit" style="width: 100%" type="primary" html-type="submit">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#user-register-page {
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
