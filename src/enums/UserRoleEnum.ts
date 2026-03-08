export enum UserRoleEnum {
  NOT_LOGIN = -1,
  USER = 0,      // 普通用户
  ADMIN = 1,   // 管理员
}

/**
 * 根据value获取枚举对象
 * @param value 枚举值
 * @returns 枚举对象，未找到返回null
 */
export const getUserRoleEnumByValue = (value: number | null | undefined): UserRoleEnum | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (Object.values(UserRoleEnum).includes(value)) {
    return value as UserRoleEnum;
  }

  return null;
}

