<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { PictureUploadByBatchRequest } from '@/types'
import { uploadPictureByBatchApi } from '@/api'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const formData = reactive<PictureUploadByBatchRequest>({
  count: 10,
})
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const spaceId = computed(() => route.query?.spaceId as string)

const handleSubmit = async () => {
  loading.value = true
  formData.spaceId = spaceId.value
  try {
    const res = await uploadPictureByBatchApi(formData)
    if (res.data > 0) {
      await message.success(`成功创建 ${res.data} 张图片`)
      router.back()
    } else {
      message.error('创建图片失败')
    }
  } catch (error) {
    message.error('创建图片失败')
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div id="addPictureBatchPage">
    <!-- 标题栏 -->
    <div class="picture-batch-title">
      <a-typography-title :level="3">批量创建图片</a-typography-title>
      <a-typography-paragraph v-if="spaceId" type="secondary">
        保存至空间：<a :href="`/space/detail/${spaceId}`" target="_blank">{{ spaceId }}</a>
      </a-typography-paragraph>
    </div>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="关键词" name="searchText">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" />
      </a-form-item>
      <a-form-item label="抓取数量" name="count">
        <a-input-number
          v-model:value="formData.count"
          placeholder="请输入数量"
          style="min-width: 180px"
          :min="1"
          :max="30"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="名称前缀" name="namePrefix">
        <a-input v-model:value="formData.namePrefix" placeholder="请输入名称前缀，会自动补充序号" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          执行任务
        </a-button>
      </a-form-item>
    </a-form>
  </div>

</template>

<style scoped>
#addPictureBatchPage {
  width: 500px;
  margin: 0 auto;
  padding: 24px;
}
</style>
