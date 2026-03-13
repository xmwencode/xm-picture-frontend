import request from '@/api/requet.ts'
import type {
  DeleteRequest,
  SpaceAddRequest,
  SpaceEditRequest,
  SpaceQueryRequest,
  SpaceUpdateRequest,
} from '@/types'

export const addSpaceApi = (data: SpaceAddRequest) => {
  return request.post('/space/add', data)
}

export const updateSpaceApi = (data: SpaceUpdateRequest) => {
  return request.post('/space/update', data)
}

export const editSpaceApi = (data: SpaceEditRequest) => {
  return request.post('/space/edit', data)
}

export const deleteSpaceApi = (data: DeleteRequest) => {
  return request.post('/space/delete', data)
}

export const listSpaceByPageApi = (data: SpaceQueryRequest) => {
  return request.post('/space/page', data)
}

export const listSpaceVOByPageApi = (data: SpaceQueryRequest) => {
  return request.post('/space/page/vo', data)
}

export const getSpaceByIdApi = (id: string) => {
  return request.get(`/space/${id}`)
}

export const getSpaceVOByIdApi = (id: string) => {
  return request.get(`/space/vo/${id}`)
}

export const listSpaceLevelApi = () => {
  return request.get('/space/list/level')
}
