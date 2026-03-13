<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Category, PictureEditRequest, PictureVO, Tag } from '@/types'
import { editPictureApi, getCategoryListApi, getPictureByIdApi, getTagListApi } from '@/api'
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
  tagIds: [],
})
const uploadType = ref<'file' | 'url'>('file')
const pictureId = computed(() => {
  return route.query?.id as string
})
const spaceId = computed(() => route.query?.spaceId as string)

const categoryList = ref<Category[]>([])
const tagList = ref<Tag[]>([])

const handleSuccess = (data: PictureVO) => {
  picture.value = data
  formData.id = data.id
  formData.name = data.name
  formData.introduction = data.introduction
  formData.categoryId = data.categoryId
  formData.url = data.url
  formData.tagIds = data.tagDTOList?.map((tag) => tag.id) ?? []
}

// 提交表单
const handleSubmit = async () => {
  try {
    formData.spaceId = spaceId.value
    const res = await editPictureApi(formData)
    if (res.data) {
      message.success('修改成功')
      // 返回上一页
      history.back()
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
    formData.tagIds = res.data.tagDTOList?.map((tag: Tag) => tag.id) ?? []
  }
}

// 获取分类
const fetchCategoryList = async () => {
  const res = await getCategoryListApi()
  if (res.data) {
    categoryList.value = res.data
  }
}

// 获取标签
const fetchTagList = async () => {
  const res = await getTagListApi()
  if (res.data) {
    tagList.value = res.data
  }
}

onMounted(() => {
  fetchPicture()
  fetchCategoryList()
  fetchTagList()
})

</script>

<template>
  <div id="picture-handle-page">
    <!-- 标题栏 -->
    <div class="picture-handle-title">
      <a-typography-title :level="3">{{ pictureId ? '修改图片' : '创建图片' }}</a-typography-title>
      <a-typography-paragraph v-if="spaceId" type="secondary">
        保存至空间：<a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
      </a-typography-paragraph>
    </div>
    <!-- 图片上传栏 -->
    <div class="picture-upload">
      <!-- 选择上传方式 -->
      <a-tabs v-model:activeKey="uploadType">
        <a-tab-pane key="file" tab="文件上传">
          <PictureUpload :spaceId="spaceId" :picture="picture" :onSuccess="handleSuccess" />
        </a-tab-pane>
        <a-tab-pane key="url" tab="URL 上传" force-render>
          <UrlPictureUpload :spaceId="spaceId" :picture="picture" :onSuccess="handleSuccess" />
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
        <!-- 图片分类 -->
        <a-form-item label="图片分类" name="categoryId">
          <a-select v-model:value="formData.categoryId" placeholder="请选择图片分类" allow-clear>
            <a-select-option v-for="category in categoryList" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--  图片标签  -->
        <a-form-item>
          <a-select
            style="min-width: 240px"
            mode="multiple"
            placeholder="请选择标签"
            allow-clear
            v-model:value="formData.tagIds"
          >
            <a-select-option v-for="tag in tagList" :value="tag.id">
              <a-tag :color="tag.color">{{ tag.name }}</a-tag>
            </a-select-option>
          </a-select>
        </a-form-item>
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
