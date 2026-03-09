import router from '@/router'
import {
  AppstoreAddOutlined,
  HomeOutlined,
  LikeOutlined, PictureOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { h } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { checkAccess } from '@/auth/checkAccess.ts'
import type { UserRoleEnum } from '@/enums/UserRoleEnum.ts'
import { useUserStore } from '@/stores/user.ts'

// 菜单配置项类型
export interface MenuConfig {
  name: string           // 与路由name匹配
  label: string          // 显示文本
  title?: string         // 提示文本
  icon?: () => any       // 图标
  children?: MenuConfig[] // 子菜单
}

// 原始菜单配置
export const menuItems: MenuConfig[] = [
  {
    name: 'Home',
    label: '首页',
    title: '首页',
    icon: () => h(HomeOutlined),
  },
  {
    name: 'AddPicture',
    label: '新建图片',
    title: '新建图片',
    icon: () => h(AppstoreAddOutlined),
  },
  {
    name: 'UserManager',
    label: '用户管理',
    title: '用户管理',
    icon: () => h(UserOutlined)
  },
  {
    name: 'PictureManager',
    label: '图片管理',
    title: '图片管理',
    icon: () => h(PictureOutlined),
  },
  {
    name: 'About',
    label: '关于',
    title: '关于',
    icon: () => h(LikeOutlined),
  },
]

// 查找路由配置（递归查找嵌套路由）
const findRouteByName = (routes: RouteRecordRaw[], name: string): RouteRecordRaw | null => {
  for (const route of routes) {
    if (route.name === name) {
      return route
    }
    if (route.children && route.children.length > 0) {
      const found = findRouteByName(route.children, name)
      if (found) return found
    }
  }
  return null
}

// 单个菜单项转换为 ant-design 的 menu item
const convertMenuToAntdItem = (menu: MenuConfig): any => {
  // 递归查找路由（支持嵌套）
  const allRoutes = router.getRoutes()
  const route = allRoutes.find(r => r.name === menu.name)

  if (!route) {
    console.warn(`未找到菜单 ${menu.name} 对应的路由`)
    return null
  }

  // 进行权限校验
  if (!checkAccess(useUserStore().loginUser, route.meta?.access as UserRoleEnum[])) return null

  const antdItem: any = {
    key: route.path,        // 使用路由path作为key
    label: menu.label,
    title: menu.title || menu.label,
  }

  // 添加图标（如果有）
  if (menu.icon) {
    antdItem.icon = menu.icon
  }

  // 递归处理子菜单
  if (menu.children && menu.children.length > 0) {
    antdItem.children = menu.children
      .map(child => convertMenuToAntdItem(child))
      .filter(item => item !== null) // 过滤掉未找到路由的项
  }

  return antdItem
}

// 转换整个菜单配置数组
export const convertMenuConfigToAntdItems = (menus: MenuConfig[] = menuItems): any[] => {
  return menus
    .map(menu => convertMenuToAntdItem(menu))
    .filter(item => item !== null)
}
