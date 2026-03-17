<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { SpaceAddRequest, SpaceLevel, SpaceUpdateRequest, SpaceVO } from '@/types'
import { SpaceLevelEnum } from '@/enums/SpaceLevelEnum.ts'
import { addSpaceApi, getSpaceVOByIdApi, listSpaceLevelApi, updateSpaceApi } from '@/api/space.ts'
import { message } from 'ant-design-vue'
import { formatSize } from '@/utils/MemoryUtils.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import { getSpaceTypeText, SpaceTypeEnum, SpaceTypeMap } from '@/enums/SpaceTypeEnum.ts'

const space = ref<SpaceVO>()
const loading = ref(false)
const spaceLevelList = ref<SpaceLevel[]>([])
const route = useRoute()

const formData = reactive<SpaceAddRequest | SpaceUpdateRequest>({
  id: '',
  spaceName: '',
  spaceLevel: SpaceLevelEnum.COMMON,
})

// 空间ID
const spaceId = computed(() => route.query?.id as string)

// 空间类别
const spaceType = computed(() => {
  if (route.query?.type) {
    return Number(route.query.type)
  }
  return SpaceTypeEnum.PRIVATE
})

// 获取空间信息
const fetchSpace = async () => {
  if (spaceId.value) {
    const res = await getSpaceVOByIdApi(spaceId.value)
    if (res.data) {
      space.value = res.data
      formData.spaceName = res.data.spaceName
      formData.spaceLevel = res.data.spaceLevel
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  loading.value = true
  if (spaceId.value) {
    // 更新空间
    try {
      (formData as SpaceUpdateRequest).id = spaceId.value
      const res = await updateSpaceApi(formData as SpaceUpdateRequest)
      if (res.data) {
        message.success('更新成功')
      } else {
        message.error('更新失败')
      }
    } catch (e) {
      message.error('更新失败')
    } finally {
      loading.value = false
    }
  } else {
    // 创建空间
    try {
      const res = await addSpaceApi({
        ...formData as SpaceAddRequest,
        spaceType: spaceType.value,
      })
      if (res.data) {
        message.success('创建成功')
        await router.push({
          path: `/space/detail/${res.data}`,
        })
      } else {
        message.error('创建失败')
      }
    } catch (e) {
      message.error('创建失败')
    } finally {
      loading.value = false
    }
  }
}

// 获取空间等级列表
const getSpaceLevelList = async () => {
  const res = await listSpaceLevelApi()
  if (res.data) {
    spaceLevelList.value = res.data ?? []
  }
}

onMounted(() => {
  getSpaceLevelList()
  fetchSpace()
})
</script>

<template>
  <div id="space-handle-page">
    <!-- 标题栏 -->
    <div class="space-handle-title">
      <a-typography-title :level="3">
        {{ spaceId ? '更新' : '创建' }}
        {{ getSpaceTypeText(spaceType) }}
      </a-typography-title>
    </div>

    <a-form layout="vertical" autocomplete="off" :model="formData" @finish="handleSubmit">
      <a-form-item label="空间名称" name="spaceName">
        <a-input v-model:value="formData.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-select
          style="min-width: 160px"
          v-model:value="formData.spaceLevel"
          placeholder="请输入空间等级"
          allow-clear
        >
          <a-select-option v-for="item in spaceLevelList" :value="item.value">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          提交
        </a-button>
      </a-form-item>
    </a-form>

    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系
        <a href="https://codefather.cn" target="_blank">管理员</a>。
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}：
        大小 {{ formatSize(spaceLevel.maxSize) }}，
        数量 {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<style scoped>
#space-handle-page {
  margin: 56px auto;
  max-width: 560px;
}
</style>
