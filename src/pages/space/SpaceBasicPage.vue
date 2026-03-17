<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, h, onMounted, ref, watch, watchEffect } from 'vue'
import { AppstoreAddOutlined, UserOutlined } from '@ant-design/icons-vue'
import { SpaceTypeEnum } from '@/enums/SpaceTypeEnum.ts'
import type { SpaceUserVO } from '@/types'
import { listMyTeamSpace } from '@/api'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const teamSpaceList = ref<SpaceUserVO[]>([])

const fixedMenuItems = ref([
  {
    key: '/space/private',
    label: '私有空间',
    icon: () => h(UserOutlined),
  },
  {
    key: '/space/add?type=' + SpaceTypeEnum.TEAM,
    label: '创建空间',
    icon: () => h(AppstoreAddOutlined),
  },
])

const sideMenuItems = computed(() => {
  if (teamSpaceList.value.length < 1) {
    return fixedMenuItems.value
  }
  // 展示团队空间的分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    return {
      key: '/space/detail/' + spaceUser.spaceId,
      label: spaceUser.space.spaceName,
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    title: '我的团队',
    children: teamSpaceSubMenus,
  }
  return [...fixedMenuItems.value, teamSpaceMenuGroup]
})

// 查询我加入的团队空间列表
const fetchMyTeamSpace = async () => {
  const res: any = await listMyTeamSpace()
  if (res.data) {
    teamSpaceList.value = res.data
  } else {
    message.error('获取团队空间列表失败')
  }
}

// 当前选中的菜单项
const selectedKeys = ref<string[]>([])

// 根据当前路由设置选中状态
watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
  },
  { immediate: true },
)

// 菜单点击事件
const handleClick = ({ key }: { key: string }) => {
  router.push(key)
}

onMounted(() => {
  fetchMyTeamSpace()
})
</script>

<template>
  <a-layout id="space-basic-page">
    <!--  侧边栏  -->
    <a-layout-sider class="space-basic-sider">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        style="width: 180px"
        mode="inline"
        :items="sideMenuItems"
        @click="handleClick"
      />
    </a-layout-sider>
    <!--  主要内容  -->
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">
#space-basic-page {
  height: 100%;
  background-color: #fff;
}

.space-basic-sider {
  background-color: #ffffff;
}

//#space-basic-page :deep(.ant-menu-root) {
//  border-bottom: none !important;
//  border-inline-end: none !important;
//}
</style>
