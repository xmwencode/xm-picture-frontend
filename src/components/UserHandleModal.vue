<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { User, UserAddRequest, UserUpdateRequest } from '@/types'
import { UserRoleEnum } from '@/enums/UserRoleEnum.ts'
import { addUserApi, updateUserApi } from '@/api'
import { message } from 'ant-design-vue'

interface Props {
  visible: boolean
  user?: User
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isEdit: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

// 表单数据
const formRef = ref()
const confirmLoading = ref(false)

// 表单模型
const formState = ref<UserAddRequest | UserUpdateRequest>({
  username: '',
  password: '',
  nickname: '',
  role: UserRoleEnum.USER,
  avatar: ''
})

// 监听 visible 变化，打开弹窗时初始化数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.isEdit && props.user) {
      // 编辑模式：填充用户数据
      formState.value = {
        id: props.user.id,
        username: props.user.username,
        nickname: props.user.nickname || '',
        role: props.user.role,
        avatar: props.user.avatar || ''
      }
    } else {
      // 新增模式：重置表单
      formState.value = {
        username: '',
        password: '',
        nickname: '',
        role: UserRoleEnum.USER,
        avatar: ''
      }
    }
  }
})

// 弹窗标题
const modalTitle = computed(() => props.isEdit ? '编辑用户' : '新增用户')

// 关闭弹窗
const handleCancel = () => {
  emit('update:visible', false)
  formRef.value?.resetFields()
}

// 确认提交
const handleOk = async () => {
  try {
    // 表单校验
    await formRef.value?.validate()

    confirmLoading.value = true

    // 根据模式调用不同接口
    if (props.isEdit) {
      const res = await updateUserApi(formState.value as UserUpdateRequest)
      if (res.data) {
        message.success('更新成功')
        emit('success')
        handleCancel()
      }
    } else {
      const res = await addUserApi(formState.value as UserAddRequest)
      if (res.data) {
        message.success('新增成功')
        emit('success')
        handleCancel()
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    confirmLoading.value = false
  }
}

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur' }
  ],
  password: [
    { required: !props.isEdit, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}
</script>

<template>
  <a-modal
    :open="visible"
    :title="modalTitle"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <!-- 用户名 -->
      <a-form-item label="用户名" name="username">
        <a-input
          v-model:value="formState.username"
          placeholder="请输入用户名"
          :disabled="isEdit"
        />
      </a-form-item>

      <!-- 密码（新增时必填，编辑时不可选） -->
      <a-form-item label="密码" name="password" v-if="!isEdit">
        <a-input-password
          v-model:value="(formState as UserAddRequest).password"
          placeholder="请输入密码"
        />
      </a-form-item>

      <!-- 昵称 -->
      <a-form-item label="昵称" name="nickname">
        <a-input
          v-model:value="formState.nickname"
          placeholder="请输入昵称"
        />
      </a-form-item>

      <!-- 角色 -->
      <a-form-item label="角色" name="role">
        <a-select v-model:value="formState.role" placeholder="请选择角色">
          <a-select-option :value="UserRoleEnum.USER">普通用户</a-select-option>
          <a-select-option :value="UserRoleEnum.ADMIN">管理员</a-select-option>
        </a-select>
      </a-form-item>

      <!-- 头像 -->
      <a-form-item label="头像" name="avatar">
        <a-input
          v-model:value="formState.avatar"
          placeholder="请输入头像URL"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
