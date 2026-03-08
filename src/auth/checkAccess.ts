// 权限检查函数
import { getUserRoleEnumByValue, UserRoleEnum } from '@/enums/UserRoleEnum'
import type { User } from '@/types'

/**
 * 检查用户是否有权限访问
 * @param user 当前用户
 * @param needAccess 需要的权限列表
 * @returns 是否有权限
 */
export const checkAccess = (user: User, needAccess: UserRoleEnum[]): boolean => {
  // 如果不需要任何权限，直接放行
  if (!needAccess || needAccess.length === 0 || needAccess.includes(UserRoleEnum.NOT_LOGIN)) {
    return true
  }

  const userAccess = getUserRoleEnumByValue(user.role)

  // 无法获取用户角色，则无权限
  if (userAccess === null) {
    return false
  }

  // 检查用户角色是否在需要的权限列表中
  return needAccess.includes(userAccess)
}
