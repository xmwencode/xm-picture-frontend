import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes.ts'
import type { UserRoleEnum } from '@/enums/UserRoleEnum.ts'
import { useUserStore } from '@/stores/user.ts'
import { checkAccess } from '@/auth/checkAccess.ts'
import { message } from 'ant-design-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router


/**
 * 路由权限校验
 */
router.beforeEach(async (to, from) => {
  // 如果不需要权限，直接放行
  if (!to.meta?.access) {
    return true
  }

  const needAccess: UserRoleEnum[] = to.meta.access as UserRoleEnum[]
  const userStore = useUserStore()

  // 如果有token但用户信息为空，先获取用户信息
  if (userStore.token && !userStore.loginUser.id) {
    await userStore.fetchLoginUser()
  }

  // 未登录，跳转到登录页
  if (!userStore.loginUser || !userStore.loginUser.role) {
    return {
      path: '/user/login'
    }
  }

  // 检查权限
  if (checkAccess(userStore.loginUser, needAccess)) {
    return true
  } else {
    console.log(userStore.loginUser)
    message.error('无权限访问')
    return {
      path: from.path,
    }
  }
})
