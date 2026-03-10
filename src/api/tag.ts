import request from '@/api/requet.ts'
import type { TagAddRequest, TagQueryRequest, TagUpdateRequest, DeleteRequest } from '@/types'

export const listTagByPageApi = (data: TagQueryRequest) => {
  return request.post('/tag/page', data)
}

export const getTagListApi = () => {
  return request.get(`/tag/list`)
}

export const addTagApi = (data: TagAddRequest) => {
  return request.post('/tag/add', data)
}

export const updateTagApi = (data: TagUpdateRequest) => {
  return request.post('/tag/update', data)
}

export const deleteTagApi = (data: DeleteRequest) => {
  return request.delete(`/tag/delete/${data}`)
}


