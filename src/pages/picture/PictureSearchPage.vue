<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ImageSearchResult, PictureVO } from '@/types'
import { getPictureVOByIdApi, searchPictureByPictureApi } from '@/api'
import { message } from 'ant-design-vue'

const route = useRoute()

// 图片 id
const pictureId = computed(() => {
  return route.query?.pictureId as string
})

const picture = ref<PictureVO>()
const dataList = ref<ImageSearchResult[]>([])
const loading = ref(false)

// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  const res = await getPictureVOByIdApi(pictureId.value)
  if (res.data) {
    picture.value = res.data
  } else {
    message.error('获取图片详情失败')
  }
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await searchPictureByPictureApi({
      pictureId: pictureId.value,
    })
    if (res.data && res.data.length > 0) {
      dataList.value = res.data
    } else {
      message.error('未找到相关图片')
    }
  } catch (error) {
    message.error('未找到相关图片')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getOldPicture()
  fetchData()
})

</script>

<template>
  <div id="search-picture-page">
    <a-typography-title :level="2">以图搜图</a-typography-title>
    <a-typography-title :level="4">原图</a-typography-title>
    <a-card style="width: 240px">
      <template #cover>
        <img
          style="height: 180px; object-fit: cover"
          :alt="picture?.name"
          :src="picture?.thumbnailUrl ?? picture?.url"
        />
      </template>
    </a-card>
    <a-typography-title style="margin: 20px 0" :level="4">识图结果</a-typography-title>
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <a-list-item style="padding: 0">
          <a :href="item.fromUrl" target="_blank">
            <a-card>
              <template #cover>
                <img style="height: 180px; object-fit: cover" :src="item.thumbUrl"  alt=""/>
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
#search-picture-page {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
