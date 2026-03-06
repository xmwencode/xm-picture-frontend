<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { helloApi } from '@/api/hello.ts'

const message = ref<string>('加载中...')

const fetchHello = async () => {

  const res = await helloApi()
  console.log(res)
  message.value = res.data ?? ''
}

onMounted(() => {
  fetchHello()
})
</script>

<template>
  <div id="about-page">
    <div class="about-page-container" style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>后端接口数据展示</h1>
      <div style="margin-top: 10px;">
        <p style="font-size: 16px;">接口响应数据：</p>
        <p style="font-size: 20px; font-weight: bold; color: #52c41a;">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
