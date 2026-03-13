<script setup lang="ts">

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import type { SpaceQueryRequest } from '@/types'
import { listSpaceVOByPageApi } from '@/api/space.ts'
import { message } from 'ant-design-vue'
import { onMounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()

// 检查用户是否有个人空间
const checkUserSpace = async () => {
  const loginUser = userStore.loginUser
  if (!loginUser?.id) {
    await router.replace('/user/login')
    return
  }
  // 获取空间用户信息
  const res = await listSpaceVOByPageApi({
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
  } as SpaceQueryRequest)
  if (res.data) {
    if (res.data?.records?.length > 0) {
      const spaceId = res.data.records[0].id
      console.log(spaceId)
      await router.replace(`/space/detail/${spaceId}`)
    } else {
      await router.replace('/space/add')
      message.warn('请先创建空间')
    }
  }
}

onMounted(() => {
  checkUserSpace()
})

</script>

<template>
  <div class="private-space-page">
    <h2>正在跳转，请稍候...</h2>
  </div>
</template>

<style scoped>

</style>
