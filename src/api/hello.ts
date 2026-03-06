import request from '@/api/requet.ts'
import type { ApiResponse } from '@/types'

export const helloApi = (): Promise<ApiResponse<string>> => {
  return request.get('/hello')
}
