import type {
  SpaceUserAddRequest,
  SpaceUserEditRequest,
  SpaceUserQueryRequest,
  SpaceUserVO
} from '@/types/spaceUser.ts'
import request from '@/api/requet.ts'
import type { DeleteRequest } from '@/types'

export const addSpaceUserApi = (data: SpaceUserAddRequest) => {
  return request.post('/spaceUser/add', data)
}

export const deleteSpaceUserApi = (data: DeleteRequest) => {
  return request.post('/spaceUser/delete', data)
}

export const editSpaceUserApi = (data: SpaceUserEditRequest) => {
  return request.post('/spaceUser/edit', data)
}

export const listSpaceUserApi = (data: SpaceUserQueryRequest) => {
  return request.post('/spaceUser/list', data)
}

export const listMyTeamSpace = () => {
  return request.get('/spaceUser/list/my')
}
