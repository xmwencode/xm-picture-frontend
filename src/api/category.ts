import request from '@/api/requet.ts'
import type { CategoryAddRequest, CategoryQueryRequest, CategoryUpdateRequest, DeleteRequest } from '@/types'

export const listCategoryByPageApi = (data: CategoryQueryRequest) => {
  return request.post('/category/page', data)
}

export const getCategoryListApi = () => {
  return request.get(`/category/list`)
}

export const addCategoryApi = (data: CategoryAddRequest) => {
  return request.post('/category/add', data)
}

export const updateCategoryApi = (data: CategoryUpdateRequest) => {
  return request.post('/category/update', data)
}

export const deleteCategoryApi = (data: DeleteRequest) => {
  return request.delete(`/category/delete/${data}`)
}


