import type { Category } from '@/types/category.ts'
import type { Tag } from '@/types/tag.ts'

export interface SpaceAnalyzeRequest {
  spaceId?: string,
  queryPublic?: boolean
  queryAll?: boolean
}

export interface SpaceCategoryAnalyzeRequest extends SpaceAnalyzeRequest {}

export interface SpaceTagAnalyzeRequest extends SpaceAnalyzeRequest {}

export interface SpaceSizeAnalyzeRequest extends SpaceAnalyzeRequest {}

export interface SpaceUsageAnalyzeRequest extends SpaceAnalyzeRequest {}

export interface SpaceUserAnalyzeRequest extends SpaceAnalyzeRequest {
  userId?: string
  timeDimension?: string
}

export interface SpaceRankAnalyzeRequest {
  topN?: number
}

export interface SpaceCategoryAnalyzeResponse {
  categoryDTO?: Category
  count?: number
  totalSize?: number
}

export interface SpaceSizeAnalyzeResponse {
  sizeRange?: string
  count?: number
}

export interface SpaceTagAnalyzeResponse {
  tagDTO?: Tag
  count?: number
}

export interface SpaceUsageAnalyzeResponse {
  usedSize?: number
  maxSize?: number
  sizeUsageRatio?: number
  usedCount?: number
  maxCount?: number
  countUsageRatio?: number
}

export interface SpaceUserAnalyzeResponse {
  period?: string
  count?: number
}



