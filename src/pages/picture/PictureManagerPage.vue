<script setup lang="ts">
import type { Category, Picture, PictureQueryRequest, PictureReviewRequest, Tag } from '@/types'
import { computed, createVNode, onMounted, reactive, ref } from 'vue'

import { message, Modal } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import { ExclamationCircleOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import { deletePictureApi, getCategoryListApi, getTagListApi, listPictureByPageApi, reviewPictureApi } from '@/api'
import { useRouter } from 'vue-router'
import { getReviewStatusColor, getReviewStatusText, PictureReviewStatusEnum, PictureReviewStatusMap } from '@/enums'

type RangeValue = [Dayjs, Dayjs]

const searchForm = reactive<PictureQueryRequest>({
  current: 1,
  pageSize: 5,
})

const dataRange = ref<RangeValue>()
const router = useRouter()
const categoryList = ref<Category[]>([])
const tagList = ref<Tag[]>([])

// 新增
const handleAdd = () => {
  router.push({ path: `/picture/add` })
}

// 编辑
const handleEdit = (record: any) => {
  const pictureId = record.id
  router.push({
    path: `/picture/add`,
    query: {
      id: pictureId,
    },
  })
}

// 删除
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '你确定要删除吗?',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要删除吗？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      const res = await deletePictureApi({
        id: record.id,
      })
      if (res.data) {
        message.success('删除成功')
        await freshData()
      }
    },
    onCancel: () => {
      return
    },
  })
}

// 查看
const handleView = (record: any) => {
  router.push({
    path: `/picture/view`,
    query: {
      id: record.id,
    },
  })
}

// 审核
const handleReview = async (record: any, status: number) => {
  const reviewMessage= status === PictureReviewStatusEnum.PASS ? '管理员操作通过' : '管理员操作拒绝'
  Modal.confirm({
    title: '图片审核',
    icon: createVNode(ExclamationCircleOutlined),
    content: '你确定执行该审核吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      const res = await reviewPictureApi({
        id: record.id,
        reviewStatus: status,
        reviewMessage: reviewMessage
      })
      if (res.data) {
        message.success('审核操作成功')
        await freshData()
      } else {
        message.error('审核操作失败')
      }
    },
  })
}

const dataList = ref<Picture[]>([])
const total = ref(0)
const loading = ref(false)

const columns = [
  {
    title: '图片ID&名称',
    dataIndex: 'id&name',
    align: 'center',
  },
  {
    title: '图片',
    dataIndex: 'url',
    align: 'center',
  },
  {
    title: '分类&标签',
    dataIndex: 'category&tag',
    align: 'center',
  },
  {
    title: '创建人&创建时间',
    dataIndex: 'nickname&createTime',
    align: 'center',
  },
  {
    title: '审核信息',
    dataIndex: 'reviewInfo',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
]

// 分页参数
const pagination = computed(() => {
  return {
    current: searchForm.current ?? 1,
    pageSize: searchForm.pageSize ?? 10,
    total: total.value,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

// 提交表单
const handleSubmit = () => {
  freshData()
}

// 获取数据
const freshData = async () => {
  loading.value = true
  try {
    const res = await listPictureByPageApi(searchForm)
    if (res.data) {
      total.value = res.data.total ?? 0
      dataList.value = res.data.records ?? []
    }
  } finally {
    loading.value = false
  }
}

// 处理表单改变
const handleTableChange = (page: any, filters: any) => {
  searchForm.current = page.current
  searchForm.pageSize = page.pageSize
  freshData()
}

/**
 * 日期范围更改时触发
 * @param dates
 */
const onRangeChange = (dates: any[]) => {
  if (dates.length < 2) {
    searchForm.startTime = undefined
    searchForm.endTime = undefined
  } else {
    // 转换为GMT+8（Asia/Shanghai）时区，并格式化为yyyy-MM-dd HH:mm:ss
    const startTime = dayjs(dates[0].toDate()).format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs(dates[1].toDate()).format('YYYY-MM-DD HH:mm:ss')
    searchForm.startTime = startTime
    searchForm.endTime = endTime
  }
}

const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

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
  <div id="picture-manager-page">
    <!-- 标题栏 -->
    <div class="picture-manager-title">
      <a-typography-title :level="3">图片管理</a-typography-title>
      <div class="picture-manager-options">
        <a-button @click="handleAdd" type="primary">
          <template #icon>
            <PlusCircleOutlined />
          </template>
          新增图片
        </a-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <div class="picture-search">
      <a-form style="display: flex" :model="searchForm" autocomplete="off" @finish="handleSubmit">
        <a-space :size="20">
          <!--  图片ID  -->
          <a-form-item>
            <a-input
              style="min-width: 100px"
              placeholder="请输入图片ID"
              allow-clear
              v-model:value="searchForm.id"
            />
          </a-form-item>
          <!--  关键字  -->
          <a-form-item>
            <a-input
              style="min-width: 100px"
              placeholder="请输入关键字"
              allow-clear
              v-model:value="searchForm.text"
            />
          </a-form-item>
          <!--  分类  -->
          <a-form-item>
            <a-select
              style="min-width: 120px"
              placeholder="请选择分类"
              allow-clear
              v-model:value="searchForm.categoryId"
            >
              <a-select-option v-for="category in categoryList" :value="category.id">
                {{ category.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!--  标签  -->
          <a-form-item>
            <a-select
              style="min-width: 240px"
              mode="multiple"
              placeholder="请选择标签"
              allow-clear
              v-model:value="searchForm.tagIds"
            >
              <a-select-option v-for="tag in tagList" :value="tag.id">
                <a-tag :color="tag.color">{{ tag.name }}</a-tag>
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 审核状态 -->
          <a-form-item>
            <a-select
              style="min-width: 140px"
              placeholder="请选择审核状态"
              allow-clear
              v-model:value="searchForm.reviewStatus"
            >
              <a-select-option
                v-for="(label, value) in PictureReviewStatusMap"
                :key="value"
                :value="Number(value)"
              >
                {{ label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!--  创建时间  -->
          <a-form-item>
            <a-range-picker
              v-model:value="dataRange"
              show-time
              :placeholder="['创建开始时间', '创建结束时间']"
              @change="onRangeChange"
              format="YYYY/MM/DD HH:mm:ss"
              :preset="rangePresets"
              allow-clear
            />
          </a-form-item>
          <!-- 搜索按钮 -->
          <a-form-item>
            <a-button style="width: 100px" type="primary" html-type="submit">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-form-item>
        </a-space>
      </a-form>
    </div>

    <!-- 数据列表 -->
    <div class="picture-list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{ y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'id&name'">
            <router-link :to="`/picture/detail/${record.id}`" target="_blank">
              <a-space direction="vertical">
                <a-typography-text type="secondary">{{ record.id }}</a-typography-text>
                <a-typography-text>{{ record.name }}</a-typography-text>
              </a-space>
            </router-link>
          </template>
          <template v-if="column.dataIndex === 'category&tag'">
            <a-space direction="vertical">
              <a-tag :bordered="false"> {{ record.categoryDTO?.name ?? '暂无分类' }}</a-tag>
              <a-tag :bordered="false" :color="tag.color" v-for="tag in record.tagDTOList" :key="tag.id"> {{ tag.name }}</a-tag>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'url'">
            <a-image v-if="record.url" :src="record.url" />
          </template>
          <template v-if="column.dataIndex === 'nickname&createTime'">
            <a-space direction="vertical">
              <a-typography-text type="secondary">{{ record.userDTO?.nickname ?? '-' }}</a-typography-text>
              <a-typography-text>{{ record.createTime }}</a-typography-text>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'reviewInfo'">
            <a-space direction="vertical">
              <!-- 审核人 -->
              <a-space direction="vertical" v-if="record.reviewUserId">
                <a-typography-text type="secondary">{{ record.reviewUserId }} 审核</a-typography-text>
              </a-space>
              <!-- 审核状态 -->
              <a-space>
                审核状态:
                <a-tag :color="getReviewStatusColor(record.reviewStatus)">
                  {{ getReviewStatusText(record.reviewStatus) }}
                </a-tag>
              </a-space>
              <!-- 审核信息 -->
              <a-typography-text :type="getReviewStatusColor(record.reviewStatus)">
                {{ record.reviewMessage }}
              </a-typography-text>
            </a-space>
          </template>
          <template v-if="column.key === 'action'">
            <a-space direction="vertical">
              <a-button
                v-if="record.reviewStatus !== PictureReviewStatusEnum.PASS"
                type="link"
                @click="handleReview(record, PictureReviewStatusEnum.PASS)"
              >
                通过
              </a-button>
              <a-button
                v-if="record.reviewStatus !== PictureReviewStatusEnum.REJECT"
                type="link" danger
                @click="handleReview(record, PictureReviewStatusEnum.REJECT)"
              >
                拒绝
              </a-button>
              <a-button size="small" ghost type="primary" @click="handleEdit(record)">编辑</a-button>
              <a-button size="small" ghost type="dashed" danger @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
#picture-manager-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.picture-manager-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin-top: 20px;
}

.picture-search {
  margin-top: 20px;
  width: 90%;
  height: 80px;
}

.picture-list {
  width: 90%;
  height: 500px;
}
</style>
