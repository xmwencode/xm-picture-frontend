<script setup lang="ts">
import type { Tag, TagQueryRequest } from '@/types'
import { computed, createVNode, onMounted, reactive, ref } from 'vue'

import { message, Modal } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import { ExclamationCircleOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import { deleteTagApi, getTagListApi, listTagByPageApi } from '@/api'
import { formatDate } from '@/utils/DayUtils.ts'
import { useRoute, useRouter } from 'vue-router'
import TagHandleModal from '@/components/TagHandleModal.vue'

type RangeValue = [Dayjs, Dayjs]

const searchForm = reactive<TagQueryRequest>({
  current: 1,
  pageSize: 5,
})

const dataRange = ref<RangeValue>()
const router = useRouter()
const tagList = ref<Tag[]>([])
const modalVisible = ref(false)
const currentTag = ref()
const isEdit = ref(false)

// 新增
const handleAdd = () => {
  isEdit.value = false
  currentTag.value = undefined
  modalVisible.value = true
}

// 编辑
const handleEdit = (record: any) => {
  isEdit.value = true
  currentTag.value = record
  modalVisible.value = true
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
      const res = await deleteTagApi({
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

const onSuccess = () => {
  modalVisible.value = false
  freshData()
}

const dataList = ref<Tag[]>([])
const total = ref(0)
const loading = ref(false)

const columns = [
  {
    title: '标签ID',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '标签名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '标签颜色',
    dataIndex: 'color',
    align: 'center',
  },
  {
    title: '标签描述',
    dataIndex: 'description',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
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
    const res = await listTagByPageApi(searchForm)
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

// 获取标签
const fetchTagList = async () => {
  const res = await getTagListApi()
  if (res.data) {
    tagList.value = res.data
  }
}

onMounted(() => {
  fetchTagList()
  freshData()
})
</script>

<template>
  <div id="tag-manager-page">
    <!-- 标题栏 -->
    <div class="tag-manager-title">
      <a-typography-title :level="3">标签管理</a-typography-title>
      <div class="tag-manager-options">
        <a-button @click="handleAdd" type="primary">
          <template #icon>
            <PlusCircleOutlined />
          </template>
          新增标签
        </a-button>
      </div>
    </div>
    <!-- 搜索表单 -->
    <div class="tag-search">
      <a-form style="display: flex" :model="searchForm" autocomplete="off" @finish="handleSubmit">
        <a-space :size="20">
          <!--  标签ID  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入标签ID"
              allow-clear
              v-model:value="searchForm.id"
            />
          </a-form-item>
          <!--  关键字  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入关键字"
              allow-clear
              v-model:value="searchForm.text"
            />
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
    <div class="tag-list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{ y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'id'">
            <a-space direction="vertical">
              <a-typography-text type="secondary">{{ record.id }}</a-typography-text>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'name'">
            <a-typography-text>{{ record.name }}</a-typography-text>
          </template>
          <template v-if="column.dataIndex === 'color'">
            <a-space>
              <div :style="{ width: '20px', height: '20px', backgroundColor: record.color, borderRadius: '50%' }"></div>
              <a-tag>{{ record.color }}</a-tag>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'description'">
            <a-typography-text :ellipsis="true">{{ record.description }}</a-typography-text>
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ formatDate(record.createTime) }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-divider type="vertical" />
              <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
    <TagHandleModal
      v-model:visible="modalVisible"
      :is-edit="isEdit"
      :tag="currentTag"
      @success="onSuccess"
    />
  </div>
</template>

<style scoped>
#tag-manager-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.tag-manager-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin-top: 20px;
}

.tag-search {
  margin-top: 20px;
  width: 90%;
  height: 80px;
}

.tag-list {
  width: 90%;
  height: 500px;
}
</style>
