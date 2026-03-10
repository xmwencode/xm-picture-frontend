import type { Category, PageParams, Tag, User } from '@/types'

export interface Picture {
  id: string
  name: string
  url: string
  introduction?: string
  createTime: string
  categoryId?: string
  categoryDTO?: Category
  picSize?: number
  picWidth?: number
  picHeight?: number
  picScale?: number
  picFormat?: string
  userId?: string
  userDTO?: User
}

export interface PictureUploadRequest {
  id?: string
  url?: string
}

export interface PictureVO {
  id: string
  name: string
  url: string
  introduction?: string
  createTime: string
  categoryId?: string
  categoryName?: string
  tagDTOList?: Tag[]
  picSize?: number
  picWidth?: number
  picHeight?: number
  picScale?: number
  picFormat?: string
  userId?: string
  userNickname?: string
}

export interface PictureUpdateRequest {
  id: string
  name?: string
  url?: string
  introduction?: string
  categoryId?: string
  tagIds?: string[]
}

export interface PictureEditRequest {
  id: string
  name?: string
  url?: string
  introduction?: string
  categoryId?: string
  tagIds?: string[]
}

export interface PictureQueryRequest extends PageParams {
  id?: string
  text?: string
  url?: string
  categoryId?: string
  tagIds?: string[]
  userId?: string
  startTime?: string
  endTime?: string
  picSize?: number
  picWidth?: number
  picHeight?: number
  picScale?: number
  picFormat?: string
}
