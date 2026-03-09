<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { PictureEditRequest, PictureVO } from '@/types'
import { editPictureApi, getPictureByIdApi } from '@/api'
import { message } from 'ant-design-vue'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'

const route = useRoute()
const picture = ref<PictureVO>()
const formData = reactive<PictureEditRequest>({
  id: '',
  name: '',
  introduction: '',
  categoryId: '',
  url: '',
})
const uploadType = ref<'file' | 'url'>('file')
const pictureId = computed(() => {
  return route.query?.id as string ?? ''
})

const handleSuccess = (data: PictureVO) => {
  picture.value = data
  formData.id = data.id
  formData.name = data.name
  formData.introduction = data.introduction
  formData.categoryId = data.categoryId
  formData.url = data.url
}

// 提交表单
const handleSubmit = async () => {
  try {
    const res = await editPictureApi(formData)
    if (res.data) {
      message.success('修改成功')
    } else {
      message.error('修改失败')
    }
  } catch (e) {
    message.error('修改失败')
  }
}

// 获取图片信息
const fetchPicture = async () => {
  if (!pictureId.value) return
  const res = await getPictureByIdApi(pictureId.value)
  console.log(res.data)
  if (res.data) {
    picture.value = res.data
    formData.id = res.data.id
    formData.name = res.data.name
    formData.introduction = res.data.introduction
    formData.categoryId = res.data.categoryId
    formData.url = res.data.url
  }
}

onMounted(() => {
  fetchPicture()
})

</script>

<template>
  <div id="picture-handle-page">
    <!-- 标题栏 -->
    <div class="picture-handle-title">
      <a-typography-title :level="3">{{ pictureId ? '修改图片' : '创建图片' }}</a-typography-title>
    </div>
    <!-- 图片上传栏 -->
    <div class="picture-upload">
      <!-- 选择上传方式 -->
      <a-tabs v-model:activeKey="uploadType">
        <a-tab-pane key="file" tab="文件上传">
          <PictureUpload :picture="picture" :onSuccess="handleSuccess" />
        </a-tab-pane>
        <a-tab-pane key="url" tab="URL 上传" force-render>
          <UrlPictureUpload :picture="picture" :onSuccess="handleSuccess" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 表单栏 -->
    <div class="picture-handle-form">
      <a-form
        :model="formData"
        layout="vertical"
        style="width: 100%"
        @submit="handleSubmit"
        v-if="picture?.id"
      >
        <!-- 图片名称 -->
        <a-form-item label="图片名称" name="name">
          <a-input v-model:value="formData.name" />
        </a-form-item>
        <!-- 图片简介 -->
        <a-form-item label="图片简介" name="introduction">
          <a-textarea rows="3" v-model:value="formData.introduction" />
        </a-form-item>
        <!-- TODO: 图片分类 -->
        <!-- TODO: 图片标签 -->
        <!-- 确认按钮 -->
        <a-form-item>
          <a-button style="width: 100%" type="default" html-type="submit"> 确认 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
#picture-handle-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.picture-handle-title {
  text-align: center;
  width: 600px;
}

.picture-upload {
  width: 480px;
}

.picture-handle-form {
  width: 480px;
  margin-top: 20px;
}
</style>
