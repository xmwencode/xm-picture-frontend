import type { PageParams } from '@/types/common.ts'

export interface Category {
  id: string
  name: string
  description?: string
  createTime: string
}


export interface CategoryAddRequest {
  name: string
  description?: string
}

export interface CategoryUpdateRequest {
  id: string
  name: string
  description?: string
}

export interface CategoryQueryRequest extends PageParams {
  id?: string
  text?: string
  startTime?: string
  endTime?: string
}
