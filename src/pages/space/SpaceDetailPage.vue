<script setup lang="ts">
import type { Category, PictureQueryRequest, SpaceVO, Tag } from '@/types'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { getSpaceVOByIdApi } from '@/api/space.ts'
import { getCategoryListApi, getTagListApi, listPictureVOByPageApi } from '@/api'
import PictureList from '@/components/PictureList.vue'
import { formatSize } from '@/utils/MemoryUtils.ts'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { message } from 'ant-design-vue'
import PictureBatchEditModal from '@/components/PictureBatchEditModal.vue'
import { BarChartOutlined, EditOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  id: string
}>()

// 数据
const space = ref<SpaceVO>()
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
const pictureBatchEditModalRef = ref()

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
    message.error('获取空间详情失败')
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
const handleSearch = (newSearchForm: PictureQueryRequest) => {
  Object.assign(searchForm, newSearchForm)
  searchForm.current = 1
  searchForm.pageSize = 12
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  searchForm.spaceId = props.id
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

const handleBatchEdit = () => {
  if (pictureBatchEditModalRef.value) {
    pictureBatchEditModalRef.value.openModal()
  }
}

onMounted(() => {
  fetchSpaceDetail()
  fetchData()
})
</script>

<template>
  <div id="space-detail-page">
    <!-- 空间信息 -->
    <a-flex justify="space-between" style="margin-bottom: 20px">
      <a-typography-title :level="4"> {{ space?.spaceName }} （私有空间）</a-typography-title>
      <a-space size="middle">
        <a-button type="primary" :href="`/picture/add?spaceId=${id}`"> + 创建图片</a-button>
        <a-button type="primary" :href="`/picture/batch/add?spaceId=${id}`" ghost>
          + 批量创建图片
        </a-button>
        <a-button :icon="h(EditOutlined)" @click="handleBatchEdit"> 批量编辑</a-button>
        <a-button
          ghost
          style="background-color: #7597e6"
          :icon="h(BarChartOutlined)"
          :href="`/space/analyze?spaceId=${id}`"
          target="_blank"
        >
          空间分析
        </a-button>

        <a-tooltip
          :title="`占用空间 ${formatSize(space?.totalSize)} / ${formatSize(space?.maxSize)}`"
        >
          <a-progress
            type="circle"
            :percent="((Number(space?.totalSize) * 100) / (Number(space?.maxSize))).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>

    <!-- 搜索栏 -->
    <PictureSearchForm :on-search="handleSearch" />

    <div style="margin-top: 24px" />

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
        :total="Number(total)"
        v-model:current="searchForm.current"
        v-model:page-size="searchForm.pageSize"
        :show-total="pagination.showTotal"
        @change="fetchData"
        :hideOnSinglePage="true"
      />
    </a-flex>

    <PictureBatchEditModal
      ref="pictureBatchEditModalRef"
      :spaceId="id"
      :pictureList="dataList"
      :onSuccess="fetchData"
    />
  </div>
</template>

<style scoped></style>
