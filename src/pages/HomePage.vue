<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { Category, PictureQueryRequest, Tag } from '@/types'
import { getCategoryListApi, getTagListApi, listPictureVOByPageApi } from '@/api'

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
const categoryList = ref<Category[]>([])
const tagList = ref<Tag[]>([])
const selectedCategoryId = ref<string>('all')
const isSelectedTagList = ref<boolean[]>([])

// 点击图片
const handleClickPicture = (picture: any) => {
  // 跳转到图片详情页面，打开新窗口
  window.open(`/picture/detail/${picture.id}`, '_blank')
}

// 搜索条件
const searchForm = reactive<PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchForm.current ?? 1,
    pageSize: searchForm.pageSize ?? 12,
    total: total.value,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

// 搜索
const handleSearch = () => {
  searchForm.current = 1
  searchForm.pageSize = 12
  freshData()
}

// 获取数据
const freshData = async () => {
  loading.value = true

  searchForm.categoryId = selectedCategoryId.value === 'all' ? undefined : selectedCategoryId.value
  const selectedTagIds: string[] = []
  isSelectedTagList.value.forEach((isSelected, index) => {
    if (isSelected && tagList.value[index]) {
      selectedTagIds.push(tagList.value[index].id)
    }
  })
  searchForm.tagIds = selectedTagIds.length > 0 ? selectedTagIds : undefined

  try {
    const res = await listPictureVOByPageApi(searchForm)
    if (res.data) {
      total.value = res.data.total ?? 0
      dataList.value = res.data.records ?? []
    }
  } finally {
    loading.value = false
  }
}

// 处理表单改变
const handleTableChange = (current: number, pageSize: number) => {
  searchForm.current = current
  searchForm.pageSize = pageSize

  freshData()
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
  fetchCategoryList()
  fetchTagList()
  freshData()
})
</script>

<template>
  <div id="home-page">
    <!-- 顶部搜索栏 -->
    <div class="picture-search">
      <a-input-search
        v-model:value="searchForm.text"
        placeholder="从海量图片中搜索"
        enter-button
        @search="freshData"
        allow-clear
      />
    </div>
    <!-- 分类搜索 -->
    <a-tabs v-model:activeKey="selectedCategoryId" @change="handleSearch">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane v-for="category in categoryList" :key="category.id" :tab="category.name" />
    </a-tabs>
    <!-- 标签搜索 -->
    <div class="tag-bar" v-show="false">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag.id"
          v-model:checked="isSelectedTagList[index]"
          @change="handleSearch"
        >
          {{ tag.name }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 12, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item>
          <a-card hoverable>
            <template #cover>
              <a-image
                style="height: 180px; object-fit: cover"
                :src="picture.url"
                :alt="picture.name"
              />
            </template>
            <a-card-meta @click="handleClickPicture(picture)" :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag :bordered="false">{{ picture.categoryName ?? '默认' }}</a-tag>
                  <a-tag :bordered="false" v-for="tag in picture.tagDTOList" :key="tag" :color="tag.color">
                    {{ tag.name }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <!-- 分页 -->
    <a-flex justify="center">
      <a-pagination
        :total="total"
        v-model:current="searchForm.current"
        v-model:page-size="searchForm.pageSize"
        :show-total="pagination.showTotal"
        @change="freshData"
        :hideOnSinglePage="true"
      />
    </a-flex>
  </div>
</template>

<style scoped>
#home-page {
  margin: 0 auto;
  width: 90%;
  height: 100%;
}

.picture-search {
  max-width: 480px;
  margin: 16px auto 8px;
}

.tag-bar {
  margin: 8px auto 16px;
}



</style>
