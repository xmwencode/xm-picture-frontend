import dayjs from 'dayjs'

/**
 * 将 Dayjs 对象格式化为 2026-03-06 17:23:02 格式字符串
 * @param date Dayjs 对象或日期字符串/时间戳
 * @returns 格式化后的字符串，如 2026-03-06 17:23:02
 */
export const formatDateTime = (date: dayjs.Dayjs | string | number | Date | null | undefined): string => {
  if (!date) {
    return ''
  }
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 将 Dayjs 对象格式化为 2026-03-06 格式日期字符串
 * @param date Dayjs 对象或日期字符串/时间戳
 * @returns 格式化后的字符串，如 2026-03-06
 */
export const formatDate = (date: dayjs.Dayjs | string | number | Date | null | undefined): string => {
  if (!date) {
    return ''
  }
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 将 Dayjs 对象格式化为 17:23:02 格式时间字符串
 * @param date Dayjs 对象或日期字符串/时间戳
 * @returns 格式化后的字符串，如 17:23:02
 */
export const formatTime = (date: dayjs.Dayjs | string | number | Date | null | undefined): string => {
  if (!date) {
    return ''
  }
  return dayjs(date).format('HH:mm:ss')
}
