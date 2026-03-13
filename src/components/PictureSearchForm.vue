<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { onMounted, reactive, ref } from 'vue'
import type { Category, PictureQueryRequest, Tag } from '@/types'
import { getCategoryListApi, getTagListApi } from '@/api'

type RangeValue = [Dayjs, Dayjs]

interface Props {
  onSearch?: (searchForm: PictureQueryRequest) => void
}

const props = defineProps<Props>()

const searchForm = reactive<PictureQueryRequest>({
  current: 1,
  pageSize: 12,
})

const dataRange = ref<RangeValue>()
const categoryList = ref<Category[]>([])
const tagList = ref<Tag[]>([])


/**
 * 日期范围更改时触发
 * @param dates
 */
const onRangeChange = (dates: any[]) => {
  if (dates.length < 2) {
    searchForm.startTime = undefined
    searchForm.endTime = undefined
  } else {
    // 转换为GMT+8（Asia/Shanghai）时区，并格式化为yyyy-MM-dd HH:mm:ss
    const startTime = dayjs(dates[0].toDate()).format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs(dates[1].toDate()).format('YYYY-MM-DD HH:mm:ss')
    searchForm.startTime = startTime
    searchForm.endTime = endTime
  }
}

const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

// 获取分类
const fetchCategoryList = async () => {
  const res = await getCategoryListApi()
  if (res.data) {
    categoryList.value = res.data
  }
}

// 获取标签
const fetchTagList = async () => {
  const res = await getTagListApi()
  if (res.data) {
    tagList.value = res.data
  }
}

// 搜索
const handleSearch = () => {
  props.onSearch?.(searchForm)
}

// 重置
const handleClear = () => {
  // 取消所有对象的值
  Object.keys(searchForm).forEach((key) => {
    (searchForm as any)[key] = undefined
  })
  props.onSearch?.(searchForm)
}

onMounted(() => {
  fetchCategoryList()
  fetchTagList()
})

</script>

<template>
  <div class="picture-search-form">
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchForm" @finish="handleSearch">
      <!--  关键字  -->
      <a-form-item>
        <a-input
          style="min-width: 100px"
          placeholder="请输入关键字"
          allow-clear
          v-model:value="searchForm.text"
        />
      </a-form-item>
      <!--  分类  -->
      <a-form-item>
        <a-select
          style="min-width: 120px"
          placeholder="请选择分类"
          allow-clear
          v-model:value="searchForm.categoryId"
        >
          <a-select-option v-for="category in categoryList" :value="category.id">
            {{ category.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!--  标签  -->
      <a-form-item>
        <a-select
          style="min-width: 240px"
          mode="multiple"
          placeholder="请选择标签"
          allow-clear
          v-model:value="searchForm.tagIds"
        >
          <a-select-option v-for="tag in tagList" :value="tag.id">
            <a-tag :color="tag.color">{{ tag.name }}</a-tag>
          </a-select-option>
        </a-select>
      </a-form-item>
      <!--  创建时间  -->
      <a-form-item>
        <a-range-picker
          v-model:value="dataRange"
          show-time
          :placeholder="['创建开始时间', '创建结束时间']"
          @change="onRangeChange"
          format="YYYY/MM/DD HH:mm:ss"
          :preset="rangePresets"
          allow-clear
        />
      </a-form-item>
      <!-- 搜索按钮 -->
      <a-form-item>
        <a-space>
          <a-button style="width: 96px" type="primary" html-type="submit">
            搜索
          </a-button>
          <a-button style="width: 96px" html-type="reset" @click="handleClear">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>

</template>

<style scoped>
.picture-search-form .ant-form-item {
  margin-top: 16px;
}

</style>
