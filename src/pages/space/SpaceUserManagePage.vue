<script setup lang="ts">
import type { SpaceRole, SpaceUserQueryRequest, SpaceUserVO } from '@/types'
import { createVNode, h, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { deleteSpaceUserApi, editSpaceUserApi, listSpaceRoleApi, listSpaceUserApi } from '@/api'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

interface Props {
  id: string
}

const props = defineProps<Props>()
const userStore = useUserStore()
const loginUser = userStore.loginUser

const searchForm = reactive<SpaceUserQueryRequest>({})

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
      const res = await deleteSpaceUserApi(record.id)
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

// 编辑用户角色
const editSpaceRole = async (value: string, record: any) => {
  const res = await editSpaceUserApi({
    id: record.id,
    spaceRoleId: value,
  })
  if (res.data) {
    message.success('修改成功')
    await freshData()
  }
}

const dataList = ref<SpaceUserVO[]>([])
const loading = ref(false)
const spaceRoleList = ref<SpaceRole[]>([])

// 表格列
const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
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

// 获取数据
const freshData = async () => {
  loading.value = true
  const spaceId = props.id
  if (!spaceId) return

  try {
    const res: any = await listSpaceUserApi({
      spaceId,
    })
    if (res.data) {
      dataList.value = res.data ?? []
    }
    console.log(res.data)
  } finally {
    loading.value = false
  }
}

// 获取空间用户角色列表
const fetchSpaceUserRoles = async () => {
  const res = await listSpaceRoleApi()
  if (res.data) {
    spaceRoleList.value = res.data
    console.log(spaceRoleList.value)
  } else {
    message.warning('获取空间用户角色列表失败')
  }
}

onMounted(() => {
  fetchSpaceUserRoles()
  freshData()
})
</script>

<template>
  <div id="space-user-manage-page">
    <!-- 标题栏 -->
    <div class="space-user-manage-title">
      <a-typography-title :level="3">
        {{ props.id }}
        空间用户管理
      </a-typography-title>
      <a-space>
        <a-button type="primary">+ 添加用户</a-button>
      </a-space>
    </div>

    <!-- 数据列表 -->
    <div class="space-user-list">
      <a-table :columns="columns" :data-source="dataList">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userInfo'">
            <a-space>
              <a-avatar v-if="record.user.avatar" :src="record.user.avatar" />
              <a-avatar v-else :style="{ backgroundColor: '#1890ff' }">
                {{ record.user.username?.charAt(0)?.toUpperCase() }}
              </a-avatar>
              {{ record.user?.nickname }}
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'spaceRole'">
            <a-select
              v-if="
                spaceRoleList.find((role) => role.id === dataList.find((u) => u.userId === loginUser.id)?.spaceRoleId)
                  ?.roleCode === 'ADMIN' && record.userId !== loginUser.id
              "
              v-model:value="record.spaceRoleId"
              :options="spaceRoleList"
              :fieldNames="{ label: 'roleName', value: 'id' }"
              @change="(value: string) => editSpaceRole(value, record)"
              style="width: 120px"
            />
            <span v-else>
              {{ spaceRoleList.find((role) => role.id === record.spaceRoleId)?.roleName }}
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space wrap>
              <a-button type="link" danger @click="handleDelete(record.id)">移除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
#space-user-manage-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.space-user-manage-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-top: 20px;
}

.space-user-list {
  width: 80%;
  height: 500px;
  margin-top: 20px;
}
</style>
