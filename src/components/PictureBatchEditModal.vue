<script setup lang="ts">
// 定义组件属性类型
import { onMounted, reactive, ref, defineExpose } from 'vue'
import { batchEditPictureApi, getCategoryListApi, getTagListApi } from '@/api'
import type { Category, PictureBatchEditRequest, PictureVO, Tag } from '@/types'
import { message } from 'ant-design-vue'

interface Props {
  pictureList: PictureVO[]
  spaceId: string
  onSuccess: () => void
}

// 给组件指定初始值
const props = withDefaults(defineProps<Props>(), {})

// 控制弹窗可见性
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  formData.pictureIds= props.pictureList.map((picture) => picture.id)
  formData.spaceId = props.spaceId
  formData.categoryId = undefined
  formData.tagIds = []
  formData.nameRule = ''
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
}

// 暴露函数给父组件
defineExpose({
  openModal,
})

// 初始化表单数据
const formData = reactive<PictureBatchEditRequest>({
  pictureIds: [],
  categoryId: '', // 分类
  tagIds: [], // 标签
  nameRule: '', // 命名规则
})

const categoryList = ref<Category[]>([])
const tagList = ref<Tag[]>([])

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

onMounted(() => {
  fetchCategoryList()
  fetchTagList()
})

// 提交表单
const handleSubmit = async () => {
  if (!props.pictureList) {
    return
  }
  formData.pictureIds = props.pictureList.map((picture) => picture.id)
  formData.spaceId = props.spaceId
  // console.log(formData)
  const res = await batchEditPictureApi(formData)
  if (res.data) {
    closeModal()
    message.success('批量编辑成功')
    props.onSuccess()
  }
}
</script>

<template>
  <a-modal v-model:open="visible" title="批量编辑图片" :footer="false" @cancel="closeModal">
    <a-typography-paragraph type="secondary">* 只对当前页面的图片生效</a-typography-paragraph>
    <!-- 表单项 -->
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <!--  分类  -->
      <a-form-item>
        <a-select
          style="min-width: 120px"
          placeholder="请选择分类"
          allow-clear
          v-model:value="formData.categoryId"
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
          v-model:value="formData.tagIds"
        >
          <a-select-option v-for="tag in tagList" :value="tag.id">
            <a-tag :color="tag.color">{{ tag.name }}</a-tag>
          </a-select-option>
        </a-select>
      </a-form-item>
      <!--  命名规则  -->
      <a-form-item label="命名规则" name="nameRule">
        <a-input
          v-model:value="formData.nameRule"
          placeholder="请输入命名规则，输入 {序号} 可动态生成"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
