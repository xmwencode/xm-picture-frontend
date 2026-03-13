<script setup lang="ts">

import type { Category, PictureQueryRequest, SpaceVO, Tag } from '@/types'
import { computed, onMounted, reactive, ref } from 'vue'
import { getSpaceVOByIdApi } from '@/api/space.ts'
import { getCategoryListApi, getTagListApi, listPictureVOByPageApi } from '@/api'
import PictureList from '@/components/PictureList.vue'
import { formatSize } from '@/utils/MemoryUtils.ts'

const props = defineProps<{
  id: string
}>()


// 数据
const space = ref<SpaceVO>()
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
const categoryList = ref<Category[]>([])
const tagList = ref<Tag[]>([])
const selectedCategoryId = ref<string>('all')
const isSelectedTagList = ref<boolean[]>([])

// 搜索条件
const searchForm = reactive<PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 获取数据
const fetchSpaceDetail = async () => {
  const res = await getSpaceVOByIdApi(props.id)
  if (res.data) {
    space.value = res.data
  } else {
    console.log('获取空间详情失败')
  }
}

// 分页参数
const pagination = computed(() => {
  return {
    current: searchForm.current ?? 1,
    pageSize: searchForm.pageSize ?? 12,
    total: total.value,
    showTotal: (total: number) => `图片总数 ${total} / ${space.value?.maxCount}`,
  }
})

// 搜索
const handleSearch = () => {
  searchForm.current = 1
  searchForm.pageSize = 12
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  searchForm.spaceId = props.id

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
  fetchSpaceDetail()
  fetchCategoryList()
  fetchTagList()
  fetchData()
})

</script>

<template>
  <div id="space-detail-page">
    <!-- 空间信息 -->
    <a-flex justify="space-between" style="margin-bottom: 20px">
      <a-typography-title :level="4"> {{ space?.spaceName }} （私有空间）</a-typography-title>
      <a-space size="middle">
        <a-button type="primary" :href="`/picture/add?spaceId=${id}`">
          + 创建图片
        </a-button>
        <a-tooltip
          :title="`占用空间 ${formatSize(space?.totalSize)} / ${formatSize(space?.maxSize)}`"
        >
          <a-progress
            type="circle"
            :percent="(((space?.totalSize ?? 0) * 100) / (space?.maxSize ?? 0)).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>

    <!-- 图片列表 -->
    <picture-list
      :dataList="dataList"
      :loading="loading"
      :on-success="fetchData"
      :show-options="true"
    />
    <!-- 分页 -->
    <a-flex justify="center">
      <a-pagination
        :total="total"
        v-model:current="searchForm.current"
        v-model:page-size="searchForm.pageSize"
        :show-total="pagination.showTotal"
        @change="fetchData"
        :hideOnSinglePage="true"
      />
    </a-flex>
  </div>
</template>

<style scoped>

</style>
