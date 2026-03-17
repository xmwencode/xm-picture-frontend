import type { Space, SpaceVO } from '@/types/space.ts'
import type { User } from '@/types/user.ts'

export interface SpaceUser {
  id: string
  spaceId: string
  space: Space
  userId: string
  user?: User
  createTime?: string
  spaceRoleId?: string
}

export interface SpaceUserVO {
  id: string
  spaceId: string
  space: SpaceVO
  userId: string
  user?: User
  createTime?: string
  spaceRoleId?: string
}

export interface SpaceUserQueryRequest {
  id?: string
  spaceId?: string
  userId?: string
  spaceRoleId?: string
}

export interface SpaceUserAddRequest {
  spaceId: string
  userId: string
  spaceRoleId: string
}

export interface SpaceUserEditRequest {
  id: string
  spaceRoleId?: string
}
