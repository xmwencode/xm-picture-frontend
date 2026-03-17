import request from '@/api/requet.ts'

export const listSpaceRoleApi = () => {
  return request.get(`/spaceRole/list`)
}
