<script setup lang="ts">
import type { Category, PictureQueryRequest, SpaceVO, Tag } from '@/types'
import { computed, h, onMounted, reactive, ref, watchEffect } from 'vue'
import { getSpaceVOByIdApi } from '@/api/space.ts'
import { getCategoryListApi, getTagListApi, listPictureVOByPageApi, listSpaceRoleApi, listSpaceUserApi } from '@/api'
import { useUserStore } from '@/stores/user'
import PictureList from '@/components/PictureList.vue'
import { formatSize } from '@/utils/MemoryUtils.ts'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { message } from 'ant-design-vue'
import PictureBatchEditModal from '@/components/PictureBatchEditModal.vue'
import { BarChartOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { SpaceRoleEnum, SpaceTypeEnum } from '@/enums'

const props = defineProps<{
  id: string
}>()

const userStore = useUserStore()
const loginUser = userStore.loginUser

// 数据
const space = ref<SpaceVO>()
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
const pictureBatchEditModalRef = ref()
const currentUserSpaceRole = ref<string>('')
const spaceRoleList = ref<any[]>([])

// 搜索条件
const searchForm = reactive<PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 获取空间详情
const fetchSpaceDetail = async () => {
  const res = await getSpaceVOByIdApi(props.id)
  if (res.data) {
    space.value = res.data
  } else {
    message.error('获取空间详情失败')
  }
}

// 获取空间角色列表
const fetchSpaceUserRoles = async () => {
  const res = await listSpaceRoleApi()
  if (res.data) {
    spaceRoleList.value = res.data
  }
}

// 获取当前用户在该空间的角色
const fetchCurrentUserRole = async () => {
  if (!space.value) return
  // 个人空间或者自己创建的空间，或者是管理员，有管理员权限
  if (space.value.userId === loginUser.id) {
    currentUserSpaceRole.value = SpaceRoleEnum.ADMIN
    return
  }
  
  if (space.value.spaceType === SpaceTypeEnum.TEAM) {
    const res = await listSpaceUserApi({
      spaceId: props.id,
      userId: loginUser.id,
    })
    if (res.data && res.data.length > 0) {
      const spaceUser = res.data[0]
      const roleId = spaceUser.spaceRoleId
      const role = spaceRoleList.value.find((r) => r.id === roleId)
      if (role) {
        currentUserSpaceRole.value = role.roleCode
      }
    }
  }
}

// 检查权限
const hasEditorPermission = computed(() => {
  return [SpaceRoleEnum.ADMIN, SpaceRoleEnum.EDITOR].includes(currentUserSpaceRole.value as SpaceRoleEnum)
})

const hasAdminPermission = computed(() => {
  return currentUserSpaceRole.value === SpaceRoleEnum.ADMIN
})

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

watchEffect(async () => {
  await fetchSpaceDetail()
  await fetchSpaceUserRoles()
  await fetchCurrentUserRole()
  fetchData()
})
</script>

<template>
  <div id="space-detail-page">
    <!-- 空间信息 -->
    <a-flex justify="space-between" style="margin-bottom: 20px">
      <a-typography-title :level="4">
        {{ space?.spaceName }}
        <span v-if="space?.spaceType === SpaceTypeEnum.TEAM">（团队空间）</span>
        <span v-else>（私有空间）</span>
      </a-typography-title>
      <a-space size="middle">
        <a-button v-if="hasEditorPermission" type="primary" :href="`/picture/add?spaceId=${id}`"> + 创建图片</a-button>
        <a-button v-if="hasEditorPermission" type="primary" :href="`/picture/batch/add?spaceId=${id}`" ghost>
          + 批量创建图片
        </a-button>
        <a-button v-if="hasEditorPermission" :icon="h(EditOutlined)" @click="handleBatchEdit"> 批量编辑</a-button>
        <a-button
          v-if="hasAdminPermission"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          :href="`/spaceUserManage/${id}`"
        >
          成员管理
        </a-button>
        <a-button
          v-if="hasAdminPermission"
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
