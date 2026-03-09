import request from '@/api/requet.ts'
import type { ApiResponse, DeleteRequest, PictureQueryRequest, PictureUploadRequest, PictureVO } from '@/types'

/**
 * 上传图片文件
 * @param file 图片文件
 * @param params 上传参数
 */
export const uploadPictureApi = (
  file: File,
  params?: PictureUploadRequest,
): Promise<ApiResponse<PictureVO>> => {
  const formData = new FormData()

  // 添加文件
  formData.append('file', file)
  // 添加 PictureUploadRequest 参数
  if (params) {
    if (params.id) {
      formData.append('id', params.id)
    }
    if (params.url) {
      formData.append('url', params.url)
    }
  }

  return request.post('/picture/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const uploadPictureByUrlApi = (data: PictureUploadRequest) => {
  return request.post('/picture/upload/url', data)
}

export const updatePictureApi = (data: PictureUploadRequest) => {
  return request.post('/picture/update', data)
}

export const editPictureApi = (data: PictureUploadRequest) => {
  return request.post('/picture/edit', data)
}

export const deletePictureApi = (data: DeleteRequest) => {
  return request.post('/picture/delete', data)
}

export const listPictureByPageApi = (data: PictureQueryRequest) => {
  return request.post('/picture/page', data)
}

export const listPictureVOByPageApi = (data: PictureQueryRequest) => {
  return request.post('/picture/page/vo', data)
}

export const getPictureByIdApi = (id: string) => {
  return request.get(`/picture/${id}`)
}

export const getPictureVOByIdApi = (id: string) => {
  return request.get(`/picture/vo/${id}`)
}
