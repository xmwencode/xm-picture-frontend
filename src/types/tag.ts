import type { PageParams } from '@/types/common.ts'

export interface Tag {
  id: string
  name: string
  description?: string
  color?: string
  createTime: string
}

export interface TagAddRequest {
  name: string
  description?: string
  color?: string
}

export interface TagUpdateRequest {
  id: string
  name?: string
  description?: string
  color?: string
}

export interface TagQueryRequest extends PageParams{
  id?: string
  text?: string
  color?: string
  startTime?: string
  endTime?: string
}

