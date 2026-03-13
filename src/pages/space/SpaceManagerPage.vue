<script setup lang="ts">
import type { Space, SpaceLevel, SpaceQueryRequest } from '@/types'
import { computed, createVNode, onMounted, reactive, ref } from 'vue'
import { formatDate } from '@/utils/DayUtils'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { deleteSpaceApi, listSpaceByPageApi, listSpaceLevelApi } from '@/api/space.ts'
import { getSpaceLevelColor, getSpaceLevelText, SpaceLevelMap } from '@/enums/SpaceLevelEnum.ts'
import { formatSize } from '@/utils/MemoryUtils.ts'

const searchForm = reactive<SpaceQueryRequest>({
  current: 1,
  pageSize: 5,
  sortField: 'create_time',
  sortOrder: 'descend',
})
const spaceLevelList = ref<SpaceLevel[]>([])

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
      const res = await deleteSpaceApi(record.id)
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

const dataList = ref<Space[]>([])
const total = ref(0)
const loading = ref(false)

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
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
  searchForm.current = 1
  freshData()
}

// 获取空间等级列表
const getSpaceLevelList = async () => {
  const res = await listSpaceLevelApi()
  if (res.data) {
    spaceLevelList.value = res.data ?? []
  }
}


// 获取数据
const freshData = async () => {
  loading.value = true
  try {
    const res = await listSpaceByPageApi(searchForm)
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

onMounted(() => {
  freshData()
  getSpaceLevelList()
})
</script>

<template>
  <div id="space-manager-page">
    <!-- 标题栏 -->
    <div class="space-manager-title">
      <a-typography-title :level="3">空间管理</a-typography-title>
      <a-space>
        <a-button type="primary" href="/space/add" target="_blank">+ 创建空间</a-button>
      </a-space>
    </div>
    <!-- 搜索表单 -->
    <div class="space-search">
      <a-form style="display: flex" :model="searchForm" autocomplete="off" @finish="handleSubmit">
        <a-space :size="20">
          <!--  空间ID  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入空间ID"
              allow-clear
              v-model:value="searchForm.id"
            />
          </a-form-item>
          <!--  空间名  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入空间名称"
              allow-clear
              v-model:value="searchForm.spaceName"
            />
          </a-form-item>
          <!--  用户ID  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入用户ID"
              allow-clear
              v-model:value="searchForm.userId"
            />
          </a-form-item>
          <!--  空间等级下拉框  -->
          <a-form-item>
            <a-select
              style="min-width: 160px"
              v-model:value="searchForm.spaceLevel"
              placeholder="请输入空间等级"
              allow-clear
            >
              <a-select-option v-for="item in spaceLevelList" :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!--  搜索按钮  -->
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
    <div class="space-list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{ y: 300 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'id'">
            <a-tag> {{ record.id }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'spaceName'">
            <a-tag :bordered="false" :color="getSpaceLevelColor(record.spaceLevel)"> {{ record.spaceName }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'spaceLevel'">
            <a-tag :color="getSpaceLevelColor(record.spaceLevel)">{{ getSpaceLevelText(record.spaceLevel) }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'spaceUseInfo'">
            <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
            <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ formatDate(record.createTime) }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" :href="`/space/add?id=${record.id}`" target="_blank">
                编辑
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
#space-manager-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.space-manager-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-top: 20px;
}

.space-search {
  margin-top: 20px;
  width: 80%;
  height: 80px;
}

.space-list {
  width: 80%;
  height: 500px;
}
</style>
