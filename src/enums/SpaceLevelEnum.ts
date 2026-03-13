// 空间级别枚举
export enum SpaceLevelEnum {
  COMMON = 0,
  PROFESSIONAL = 1,
  FLAGSHIP = 2,
}

// 空间级别文本映射
export const SpaceLevelMap = {
  [SpaceLevelEnum.COMMON]: '普通版',
  [SpaceLevelEnum.PROFESSIONAL]: '专业版',
  [SpaceLevelEnum.FLAGSHIP]: '旗舰版',
}

// 状态颜色映射
export const SpaceLevelColorMap = {
  [SpaceLevelEnum.COMMON]: 'default', // 默认
  [SpaceLevelEnum.PROFESSIONAL]: 'orange', // 橙色
  [SpaceLevelEnum.FLAGSHIP]: 'red', // 红色
}

// 获取空间级别文本
export const getSpaceLevelText = (status: number): string => {
  return SpaceLevelMap[status as SpaceLevelEnum] || '未知'
}

// 获取空间级别颜色
export const getSpaceLevelColor = (status: number): string => {
  return SpaceLevelColorMap[status as SpaceLevelEnum] || 'default'
}
