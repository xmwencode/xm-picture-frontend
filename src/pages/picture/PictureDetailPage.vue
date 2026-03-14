<script setup lang="ts">
import { getPictureVOByIdApi } from '@/api'
import type { PictureVO } from '@/types'
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { formatSize } from '@/utils/MemoryUtils.ts'
import { downloadImage } from '@/utils/ImageDownloadUtils.ts'

const picture = ref<PictureVO>({} as PictureVO)

const props = defineProps<{
  id: string
}>()

// 获取图片详情
const fetchPictureDetail = async () => {
  const res = await getPictureVOByIdApi(props.id)
  if (res.data) {
    picture.value = res.data
  } else {
    message.error('获取图片详情失败')
  }
}

onMounted(() => {
  fetchPictureDetail()
})
</script>

<template>
  <div id="picture-detail-page">

    <a-row :gutter="[16, 16]">
      <!-- 图片展示区域 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <a-image
            :src="picture.url"
            :alt="picture.name"
            style="max-height: 600px; object-fit: contain"
          />
        </a-card>
      </a-col>
      <!-- 图片信息区域 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <div>{{ picture.userNickname }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name ?? '未命名' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              {{ picture.categoryName ?? '默认' }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag :color="tag.color" v-for="tag in picture.tagDTOList" :key="tag">
                {{ tag.name }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-space style="margin-top: 20px" wrap>
          <a-button type="primary" @click="downloadImage(picture.url)">
            免费下载
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
#picture-detail-page {
  width: 100%;
}
</style>
