<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Tag, TagAddRequest, TagUpdateRequest } from '@/types'
import { addTagApi, updateTagApi } from '@/api'
import { message } from 'ant-design-vue'
import { ColorPicker } from 'vue3-colorpicker'

interface Props {
  visible: boolean
  tag?: Tag
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
const formState = ref<TagAddRequest | TagUpdateRequest>({
  name: '',
  description: '',
  color: ''
})

// 监听 visible 变化，打开弹窗时初始化数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.isEdit && props.tag) {
      // 编辑模式：填充标签数据
      formState.value = {
        id: props.tag.id,
        name: props.tag.name,
        description: props.tag.description || '',
        color: props.tag.color || '#1677ff'
      }
    } else {
      // 新增模式：重置表单
      formState.value = {
        name: '',
        description: '',
        color: '#1677ff'
      }
    }
  }
})

// 弹窗标题
const modalTitle = computed(() => props.isEdit ? '编辑标签' : '新增标签')

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
      const res = await updateTagApi(formState.value as TagUpdateRequest)
      if (res.data) {
        message.success('更新成功')
        emit('success')
        handleCancel()
      }
    } else {
      const res = await addTagApi(formState.value as TagAddRequest)
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
    { required: true, message: '请输入标签名', trigger: 'blur' },
    { max: 12, message: '标签名不能超过12个字符', trigger: 'blur' }
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
      <!-- 标签名 -->
      <a-form-item label="标签名" name="name">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入标签名"
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
      <!-- 颜色 -->
      <a-form-item label="颜色" style="margin-top: 16px">
        <color-picker
          format="hex"
          v-model:pure-color="formState.color"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
