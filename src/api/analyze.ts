import type {
  SpaceCategoryAnalyzeRequest, SpaceRankAnalyzeRequest, SpaceSizeAnalyzeRequest,
  SpaceTagAnalyzeRequest,
  SpaceUsageAnalyzeRequest,
  SpaceUserAnalyzeRequest
} from '@/types'
import request from '@/api/requet.ts'

export const getSpaceUsageAnalyzeApi = (data: SpaceUsageAnalyzeRequest) => {
  return request.post(`/space/analyze/usage`, data)
}

export const getSpaceUserAnalyzeApi = (data: SpaceUserAnalyzeRequest) => {
  return request.post(`/space/analyze/user`, data)
}

export const getSpaceCategoryAnalyzeApi = (data: SpaceCategoryAnalyzeRequest) => {
  return request.post(`/space/analyze/category`, data)
}

export const getSpaceTagAnalyzeApi = (data: SpaceTagAnalyzeRequest) => {
  return request.post(`/space/analyze/tag`, data)
}

export const getSpaceSizeAnalyzeApi = (data: SpaceSizeAnalyzeRequest) => {
  return request.post(`/space/analyze/size`, data)
}

export const getSpaceRankAnalyzeApi = (data: SpaceRankAnalyzeRequest) => {
  return request.post(`/space/analyze/rank`, data)
}
