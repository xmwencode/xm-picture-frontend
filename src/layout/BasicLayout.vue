<script setup lang="ts">
import GlobalHeader from '@/layout/GlobalHeader.vue'
import GlobalFooter from '@/layout/GlobalFooter.vue'
</script>

<template>
  <a-layout class="basic-layout">
    <!-- 顶部导航栏 -->
    <GlobalHeader />

    <!-- 主要内容区域 -->
    <a-layout-content class="main-content">
      <router-view />
    </a-layout-content>

    <!-- 底部版权信息 -->
    <GlobalFooter />
  </a-layout>
</template>

<style scoped>
.basic-layout {
  background: #fff none;
  min-width: 1000px;
}

.main-content {
  padding: 24px;
  background: white;
  margin: 16px auto 56px;
}
</style>
