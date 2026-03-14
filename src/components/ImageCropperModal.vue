<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { PictureUploadRequest, PictureVO } from '@/types'
import { uploadPictureApi } from '@/api'
import { message } from 'ant-design-vue'

// 是否可见
const visible = ref(false)

// 打开弹窗
const openModal = () => {
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

interface Props {
  imageUrl?: string
  picture?: PictureVO
  spaceId?: string
  onSuccess?: (newPicture: PictureVO) => void
}

interface Props {
  imageUrl?: string
}

const props = defineProps<Props>()

// 编辑器组件的引用
const cropperRef = ref()
const loading = ref(false)

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

// 缩放
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
}

const aspectRatio = ref('free')

// 计算当前宽高比
const currentAspectRatio = computed(() => {
  if (aspectRatio.value === 'free') return [0, 0]
  const [width, height] = aspectRatio.value.split(':').map(Number)
  return [width, height]
})

// 确认裁剪
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    // blob 为已裁切的文件
    cropperRef.value.getCropBlob((blob: Blob) => {
      const fileName = (props.picture?.name || 'image') + '.png'
      const file = new File([blob], fileName, { type: blob.type })
      // 上传图片
      handleUpload({ file })
    })
  })
}

/**
 * 上传图片
 * @param file
 */
const handleUpload = async ({ file }: { file: File }) => {
  loading.value = true
  try {
    const params = {
      id: props.picture?.id ?? '',
      spaceId: props.spaceId ?? '',
    } as PictureUploadRequest
    const res = await uploadPictureApi(file, params)
    if (res.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息返回给父组件
      props.onSuccess?.(res.data)
    } else {
      message.error(res.message || '图片上传失败')
    }
  } catch (e: any) {
    console.log('图片上传失败', e)
    message.error('图片上传失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <a-modal
    class="image-cropper"
    v-model:open="visible"
    title="编辑图片"
    :footer="false"
    @cancel="closeModal"
  >
    <!-- 比例选择 -->
    <div class="aspect-ratio-selector">
      <a-radio-group size="small" v-model:value="aspectRatio">
        <a-radio-button value="free">自由比例</a-radio-button>
        <a-radio-button value="1:1">1:1</a-radio-button>
        <a-radio-button value="4:3">4:3</a-radio-button>
        <a-radio-button value="16:9">16:9</a-radio-button>
        <a-radio-button value="3:4">3:4</a-radio-button>
        <a-radio-button value="9:16">9:16</a-radio-button>
      </a-radio-group>
    </div>

    <vue-cropper
      ref="cropperRef"
      :key="aspectRatio"
      :img="imageUrl"
      :autoCrop="true"
      :fixedBox="false"
      :centerBox="true"
      :canMoveBox="true"
      :info="true"
      outputType="png"
      :full="true"
      :infoTrue="true"
      :fixed="aspectRatio !== 'free'"
      :fixedNumber="currentAspectRatio"
    />

    <div style="margin-bottom: 16px" />
    <!-- 图片操作 -->
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft">向左旋转</a-button>
        <a-button @click="rotateRight">向右旋转</a-button>
        <a-button @click="changeScale(1)">放大</a-button>
        <a-button @click="changeScale(-1)">缩小</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm">确认</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<style scoped>
.image-cropper {
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px;
}

.aspect-ratio-selector {
  margin-bottom: 16px;
}
</style>
