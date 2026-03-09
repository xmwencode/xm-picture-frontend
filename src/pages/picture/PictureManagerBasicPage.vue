<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FileImageOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

const route = useRoute()
const router = useRouter()

const sideMenuItems = ref([
  {
    key: '/picture/manager',
    label: '图片管理',
    title: '图片管理',
    icon: () => h(FileImageOutlined),
  },
  {
    key: '/category/manager',
    label: '分类管理',
    title: '分类管理',
    icon: () => h(AppstoreOutlined),
  },
])

// 当前选中的菜单项
const selectedKeys = ref<string[]>([])

// 根据当前路由设置选中状态
watch(() => route.path, (path) => {
  selectedKeys.value = [path]
}, { immediate: true })

// 菜单点击事件
const handleClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<template>
  <a-layout id="picture-manager-basic-page">
    <!--  侧边栏  -->
    <a-layout-sider class="picture-manager-basic-sider">
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

<style scoped>
#picture-manager-basic-page {
  height: 100%;
  background-color: #fff;
}

.picture-manager-basic-sider {
  background-color: #ffffff;
}

</style>
