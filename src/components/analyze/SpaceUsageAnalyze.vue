<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { SpaceUsageAnalyzeResponse } from '@/types'
import { getSpaceUsageAnalyzeApi } from '@/api'
import { message } from 'ant-design-vue'
import { formatSize } from '@/utils/MemoryUtils.ts'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

// 图表数据
const data = ref<SpaceUsageAnalyzeResponse>({})
const loading = ref(true)

/**
 * 加载数据
 */
const fetchData = async () => {
  loading.value = true
  const res = await getSpaceUsageAnalyzeApi({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res.data) {
    data.value = res.data
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  fetchData()
})
</script>

<template>
  <a-flex gap="middle">
    <a-card title="存储空间" style="width: 50%">
      <div style="height: 320px; text-align: center">
        <h3>{{ formatSize(data.usedSize) }} / {{ data.maxSize ? formatSize(data.maxSize) : '无限制' }}</h3>
        <a-progress type="dashboard" :percent="data.sizeUsageRatio ?? 0" />
      </div>
    </a-card>
    <a-card title="图片数量" style="width: 50%">
      <div style="height: 320px; text-align: center">
        <h3>{{ data.usedCount }} / {{ data.maxCount ?? '无限制' }} </h3>
        <a-progress type="dashboard" :percent="data.countUsageRatio ?? 0" />
      </div>
    </a-card>
  </a-flex>
</template>

<style scoped></style>
