import type { Tag } from '@/types/tag.ts'
import type { User } from '@/types/user.ts'
import type { PageParams } from '@/types/common.ts'

export interface Space {
  id: string
  spaceName: string
  spaceLevel: number
  maxSize: number
  maxCount: number
  totalSize: number
  totalCount: number
  userId: string
  userDTO?: User
  createTime: string
}

export interface SpaceVO {
  id: string
  spaceName: string
  spaceLevel: number
  maxSize: number
  maxCount: number
  totalSize: number
  totalCount: number
  userId: string
  userNickname?: string
  createTime: string
}

export interface SpaceAddRequest {
  spaceName: string
  spaceLevel: number
}

export interface SpaceUpdateRequest {
  id: string
  spaceName?: string
  spaceLevel?: number
  maxSize?: number
  maxCount?: number
}

export interface SpaceEditRequest {
  id: string
  spaceName?: string
}

export interface SpaceQueryRequest extends PageParams {
  id?: string
  userId?: string
  spaceName?: string
  spaceLevel?: number
}

export interface SpaceLevel {
  value: number
  text: string
  maxCount: number
  maxSize: number
}
