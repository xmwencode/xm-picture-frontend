/**
 * ==================== 全局统一响应体 ====================
 * 对应后端：Result<T> 类
 * 成功标识：code === 0
 */
export interface ApiResponse<T = any> {
  code: number;
  data?: T;
  message: string;
}

/**
 * ==================== MyBatis-Plus 分页结果 ====================
 * 对应后端：MP 的 IPage<T> 分页返回对象
 */
export interface PageResult<T = any> {
  records?: T[];        // 数据列表
  total?: number;       // 总记录数
  current?: number;     // 当前页码
  size?: number;        // 每页条数
  pages?: number;       // 总页数
}

/**
 * ==================== 通用分页请求参数 ====================
 * 对应后端：PageRequest 类
 */
export interface PageParams {
  current?: number;     // 当前页号（默认1）
  pageSize?: number;   // 每页条数（默认10）
  sortField?: string; // 排序字段（可选）
  sortOrder?: string; // 排序顺序（默认descend）
}

/**
 * ==================== 通用删除请求参数 ====================
 * 对应后端：DeleteRequest 类
 */
export interface DeleteRequest {
  id: string;
}

/**
 * ==================== 全局常量 ====================
 * 统一管理成功码、排序规则
 */
export const ApiSuccessCode = 0;


export enum SortOrderEnum {
  ASC = 'ascend',    // 升序
  DESC = 'descend'   // 降序（后端默认）
}
