<script setup lang="ts">
import { ref } from 'vue'
import { defineExpose, withDefaults } from 'vue'

interface Props {
  link: string
}

// 是否可见
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  console.log('打开分享弹窗')
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
}

const props = withDefaults(defineProps<Props>(), {
  link: () => '',
})

// 暴露函数给父组件
defineExpose({
  openModal,
})
</script>

<template>
  <a-modal v-model:open="visible" :footer="false" @cancel="closeModal">
    <a-typography-title :level="3">分享图片</a-typography-title>
    <a-typography-title :level="5">复制分享链接</a-typography-title>
    <a-typography-link copyable>
      {{ link }}
    </a-typography-link>
    <div style="margin-bottom: 16px" />
    <a-typography-title :level="5">手机扫码查看</a-typography-title>
    <a-qrcode :value="link" />
  </a-modal>
</template>

<style scoped></style>
