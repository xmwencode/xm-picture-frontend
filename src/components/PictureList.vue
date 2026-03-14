<script setup lang="ts">
// 数据
import type { PictureVO } from '@/types'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { createVNode, ref } from 'vue'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { deletePictureApi } from '@/api'
import PictureShareModal from '@/components/PictureShareModal.vue'

interface Props {
  dataList?: PictureVO[]
  loading?: boolean
  showOptions?: boolean
  onSuccess?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: () => false,
  showOptions: () => false,
})

// 跳转到图片详情
const router = useRouter()
const handleClickPicture = (picture: PictureVO) => {
  window.open(`/picture/detail/${picture.id}`)
}

// 分享弹窗引用
const pictureShareModal = ref()
// 分享链接
const shareLink = ref<string>('')

// 编辑
const handleEdit = (picture: any, e: any) => {
  // 阻止事件冒泡
  e.stopPropagation()
  router.push({
    path: '/picture/add',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除
const handleDelete = (picture: any, e: any) => {
  // 阻止事件冒泡
  e.stopPropagation()
  Modal.confirm({
    title: '你确定要删除吗?',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要删除吗？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      const res = await deletePictureApi({
        id: picture.id,
      })
      if (res.data) {
        message.success('删除成功')
        props?.onSuccess && props.onSuccess()
      }
    },
    onCancel: () => {
      return
    },
  })
}

// 分享链接
const handleShare = (picture: any, e: any) => {
  // 阻止事件冒泡
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/detail/${picture.id}`
  if (pictureShareModal.value) {
    pictureShareModal.value.openModal()
  }
}

// 以图搜图
const handleSearch = (picture: any, e: any) => {
  // 阻止事件冒泡
  e.stopPropagation()
  window.open(`/picture/search?pictureId=${picture.id}`)
}
</script>

<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 12, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0 10px" @click="handleClickPicture(picture)">
          <a-card hoverable>
            <template #cover>
              <img
                style="height: 180px; object-fit: cover"
                :src="picture.thumbnailUrl ?? picture.url"
                :alt="picture.name"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag :bordered="false">{{ picture.categoryName ?? '默认' }}</a-tag>
                  <a-tag
                    :bordered="false"
                    v-for="tag in picture.tagDTOList"
                    :key="tag"
                    :color="tag.color"
                  >
                    {{ tag.name }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template #actions v-if="showOptions">
              <search-outlined @click="(e: any) => handleSearch(picture, e)" />
              <share-alt-outlined @click="(e: any) => handleShare(picture, e)" />
              <edit-outlined @click="(e: any) => handleEdit(picture, e)" />
              <delete-outlined @click="(e: any) => handleDelete(picture, e)" />
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <PictureShareModal ref="pictureShareModal" :link="shareLink" />
  </div>
</template>

<style scoped></style>
