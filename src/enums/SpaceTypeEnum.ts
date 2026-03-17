// 空间类型枚举
export enum SpaceTypeEnum {
  PRIVATE = 0,
  TEAM = 1
}

// 空间类型文本映射
export const SpaceTypeMap = {
  [SpaceTypeEnum.PRIVATE]: '私人空间',
  [SpaceTypeEnum.TEAM]: '团队空间',
}

// 获取空间类型文本
export const getSpaceTypeText = (status: number): string => {
  return SpaceTypeMap[status as SpaceTypeEnum] || '未知'
}
