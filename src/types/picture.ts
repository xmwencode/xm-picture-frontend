import type { Category, PageParams, Tag, User } from '@/types'

export interface Picture {
  id: string
  name: string
  url: string
  thumbnailUrl?: string
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
  spaceId?: string
  reviewStatus?: number
  reviewMessage?: string
  reviewUserId?: string
  reviewTime?: string
}

export interface PictureUploadRequest {
  id?: string
  url?: string
  spaceId?: string
}

export interface PictureVO {
  id: string
  name: string
  url: string
  thumbnailUrl?: string
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
  spaceId?: string
}

export interface PictureUpdateRequest {
  id: string
  spaceId?: string
  name?: string
  url?: string
  introduction?: string
  categoryId?: string
  tagIds?: string[]
}

export interface PictureEditRequest {
  id: string
  spaceId?: string
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
  spaceId?: string
  startTime?: string
  endTime?: string
  picSize?: number
  picWidth?: number
  picHeight?: number
  picScale?: number
  picFormat?: string
  reviewStatus?: number
  reviewMessage?: string
  reviewUserId?: string
}

export interface PictureReviewRequest {
  id: string
  reviewStatus: number
  reviewMessage?: string
}

export interface PictureUploadByBatchRequest {
  searchText?: string
  count?: number
  spaceId?: string
  namePrefix?: string
}

export interface ImageSearchResult {
  thumbUrl?: string
  fromUrl?: string
}

export interface SearchPictureByPictureRequest {
  pictureId: string
}

export interface PictureBatchEditRequest {
  pictureIds: string[]
  nameRule?: string
  spaceId?: string
  categoryId?: string
  tagIds?: string[]
}
