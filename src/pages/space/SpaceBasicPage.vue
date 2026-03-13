<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { h, ref, watch } from 'vue'
import {
  UserOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

const sideMenuItems = ref([
  {
    key: '/space/private',
    label: '私有空间',
    title: '私有空间',
    icon: () => h(UserOutlined),
  },
])

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
