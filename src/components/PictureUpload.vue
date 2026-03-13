<script setup lang="ts">

import type { PictureUploadRequest, PictureVO } from '@/types'
import { message } from 'ant-design-vue'
import { uploadPictureApi } from '@/api'
import { ref } from 'vue'

interface Props {
  picture?: PictureVO
  onSuccess?: (picture: PictureVO) => void
  spaceId?: string
}

const loading = ref(false)
const props = withDefaults(defineProps<Props>(), {
  picture: undefined,
  spaceId: ''
})


/**
 * 上传图片前的校验
 * @param file
 */
const beforeUpload = (file: File) => {
  const flag = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
  if (!flag) {
    message.error('暂不支持改格式的图片,推荐 使用 jpg 或 png 格式')
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('图片大小不能超过 10MB')
  }
  return flag && isLt10M
}

/**
 * 上传图片
 * @param file
 */
const handleUpload = async ({ file }: { file: File }) => {
  loading.value = true
  try {
    const params = {
      id: props.picture?.id ?? '',
      spaceId: props.spaceId ?? '',
    } as PictureUploadRequest;
    const res = await uploadPictureApi(file, params)
    if (res.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息返回给父组件
      props.onSuccess?.(res.data)
    } else {
      message.error(res.message || '图片上传失败')
    }
  } catch (e: any) {
    console.log('图片上传失败', e)
    message.error('图片上传失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="handleUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
  border-radius: 10px;
}

.picture-upload img {
  max-width: 100%;
  max-height: 480px;
  border-radius: 10px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
