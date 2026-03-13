<script setup lang="ts">
import type { PictureVO } from '@/types'
import { ref } from 'vue'
import { uploadPictureByUrlApi } from '@/api'
import { message } from 'ant-design-vue'

interface Props {
  picture?: PictureVO
  onSuccess?: (picture: PictureVO) => void
  spaceId?: string
}

const loading = ref(false)
const fileUrl = ref('')
const props = withDefaults(defineProps<Props>(), {
  picture: undefined,
  spaceId: '',
})

/**
 * 上传图片
 */
const handleUpload = async () => {
  loading.value = true
  if (!fileUrl.value) return
  try {
    const res = await uploadPictureByUrlApi({
      id: props.picture?.id ?? '',
      spaceId: props.spaceId ?? '',
      url: fileUrl.value,
    })
    if (res.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息返回给父组件
      props.onSuccess?.(res.data)
    } else {
      message.error(res.data.message || '图片上传失败')
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
  <div class="url-picture-upload">
    <a-input-group compact style="margin-bottom: 16px">
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 100px)"
        placeholder="请输入图片 URL"
      />
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 100px">
        提交
      </a-button>
    </a-input-group>
    <a-image v-if="picture?.url" :src="picture?.url" alt="avatar" />
  </div>
</template>

<style scoped>
.url-picture-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
