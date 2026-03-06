<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import BasicLayout from '@/layout/BasicLayout.vue'

// 设置 dayjs 默认语言为中文
dayjs.locale('zh-cn')
const appLocale = zhCN

</script>

<template>
  <a-config-provider :locale="appLocale">
    <div id="app">
      <basic-layout />
    </div>
  </a-config-provider>
</template>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
