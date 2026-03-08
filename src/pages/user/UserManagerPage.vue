<script setup lang="ts">
import type { User, UserQueryRequest } from '@/types'
import { computed, createVNode, onMounted, reactive, ref } from 'vue'
import { UserRoleEnum } from '@/enums/UserRoleEnum.ts'
import dayjs, { type Dayjs } from 'dayjs'
import { formatDate } from '@/utils/DayUtils'
import { UserAddOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { deleteUserApi, listUserByPageApi } from '@/api'
import UserHandleModal from '@/components/UserHandleModal.vue'
import { message, Modal } from 'ant-design-vue'

type RangeValue = [Dayjs, Dayjs]

const searchForm = reactive<UserQueryRequest>({
  current: 1,
  pageSize: 5,
})

const dataRange = ref<RangeValue>()
const modalVisible = ref(false)
const currentUser = ref()
const isEdit = ref(false)

// 新增
const handleAdd = () => {
  isEdit.value = false
  currentUser.value = undefined
  modalVisible.value = true
}

// 编辑
const handleEdit = (record: any) => {
  isEdit.value = true
  currentUser.value = record
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
      const res = await deleteUserApi(record.id)
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

// 操作成功回调
const handleSuccess = () => {
  // 刷新列表
  freshData()
  // 关闭弹窗
  modalVisible.value = false
}

const dataList = ref<User[]>([])
const total = ref(0)
const loading = ref(false)

const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
  },
  {
    title: '角色',
    dataIndex: 'role',
    filters: [
      { text: '管理员', value: UserRoleEnum.ADMIN },
      { text: '普通用户', value: UserRoleEnum.USER },
    ],
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
  freshData()
}

// 获取数据
const freshData = async () => {
  loading.value = true
  try {
    const res = await listUserByPageApi(searchForm)
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
  searchForm.role = !filters.role || filters.role.length != 1 ? undefined : filters.role[0]
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

onMounted(() => {
  freshData()
})
</script>

<template>
  <div id="user-manager-page">
    <!-- 标题栏 -->
    <div class="user-manager-title">
      <a-typography-title :level="3">用户管理</a-typography-title>
      <div class="user-manager-options">
        <a-button @click="handleAdd" type="primary">
          <template #icon>
            <UserAddOutlined />
          </template>
          新增用户
        </a-button>
      </div>
    </div>
    <!-- 搜索表单 -->
    <div class="user-search">
      <a-form style="display: flex" :model="searchForm" autocomplete="off" @finish="handleSubmit">
        <a-space :size="20">
          <!--  用户ID  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入用户ID"
              allow-clear
              v-model:value="searchForm.id"
            />
          </a-form-item>
          <!--  用户名  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入用户名"
              allow-clear
              v-model:value="searchForm.username"
            />
          </a-form-item>
          <!--  用户昵称  -->
          <a-form-item>
            <a-input
              style="min-width: 120px"
              placeholder="请输入用户昵称"
              allow-clear
              v-model:value="searchForm.nickname"
            />
          </a-form-item>
          <!--  用户角色下拉框  -->
          <a-form-item>
            <a-select
              style="min-width: 120px"
              v-model:value="searchForm.role"
              placeholder="请输入角色"
              allow-clear
            >
              <a-select-option :value="UserRoleEnum.ADMIN.valueOf()">管理员</a-select-option>
              <a-select-option :value="UserRoleEnum.USER.valueOf()">普通用户</a-select-option>
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
    <div class="user-list">
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
            <a-tag> {{ record.id }} </a-tag>
          </template>
          <template v-if="column.dataIndex === 'role'">
            <a-tag :color="record.role === UserRoleEnum.ADMIN ? 'blue' : 'green'">
              {{ record.role === UserRoleEnum.ADMIN ? '管理员' : '普通用户' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ formatDate(record.createTime) }}</span>
          </template>
          <template v-if="column.dataIndex === 'avatar'">
            <a-avatar v-if="record.avatar" :src="record.avatar" />
            <a-avatar v-else :style="{ backgroundColor: '#1890ff' }">
              {{ record.username?.charAt(0)?.toUpperCase() }}
            </a-avatar>
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

      <!-- 用户弹窗 -->
      <UserHandleModal
        v-model:visible="modalVisible"
        :user="currentUser"
        :is-edit="isEdit"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<style scoped>
#user-manager-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.user-manager-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-top: 20px;
}

.user-search {
  margin-top: 20px;
  width: 80%;
  height: 80px;
}

.user-list {
  width: 80%;
  height: 500px;
}
</style>
