<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Category, CategoryAddRequest, CategoryUpdateRequest } from '@/types'
import { addCategoryApi, updateCategoryApi } from '@/api'
import { message } from 'ant-design-vue'

interface Props {
  visible: boolean
  category?: Category
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
const formState = ref<CategoryAddRequest | CategoryUpdateRequest>({
  name: '',
  description: ''
})

// 监听 visible 变化，打开弹窗时初始化数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.isEdit && props.category) {
      // 编辑模式：填充分类数据
      formState.value = {
        id: props.category.id,
        name: props.category.name,
        description: props.category.description || '',
      }
    } else {
      // 新增模式：重置表单
      formState.value = {
        name: '',
        description: ''
      }
    }
  }
})

// 弹窗标题
const modalTitle = computed(() => props.isEdit ? '编辑分类' : '新增分类')

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
      const res = await updateCategoryApi(formState.value as CategoryUpdateRequest)
      if (res.data) {
        message.success('更新成功')
        emit('success')
        handleCancel()
      }
    } else {
      const res = await addCategoryApi(formState.value as CategoryAddRequest)
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
  name: [
    { required: true, message: '请输入分类名', trigger: 'blur' }
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
      <!-- 分类名 -->
      <a-form-item label="分类名" name="name">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入分类名"
        />
      </a-form-item>
      <!-- 描述 -->
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          placeholder="请输入描述"
          :rows="4"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
