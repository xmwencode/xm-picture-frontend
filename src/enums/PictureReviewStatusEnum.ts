export enum PictureReviewStatusEnum {
  REVIEWING= 0,
  PASS= 1,
  REJECT= 2,
}

// 状态文本映射
export const PictureReviewStatusMap = {
  [PictureReviewStatusEnum.REVIEWING]: '待审核',
  [PictureReviewStatusEnum.PASS]: '通过',
  [PictureReviewStatusEnum.REJECT]: '拒绝',
}

// 状态颜色映射
export const PictureReviewStatusColorMap = {
  [PictureReviewStatusEnum.REVIEWING]: 'warning',  // 橙色
  [PictureReviewStatusEnum.PASS]: 'success',       // 绿色
  [PictureReviewStatusEnum.REJECT]: 'error',       // 红色
}

// 获取状态文本
export const getReviewStatusText = (status: number): string => {
  return PictureReviewStatusMap[status as PictureReviewStatusEnum] || '未知'
}

// 获取状态颜色
export const getReviewStatusColor = (status: number): string => {
  return PictureReviewStatusColorMap[status as PictureReviewStatusEnum] || 'default'
}


