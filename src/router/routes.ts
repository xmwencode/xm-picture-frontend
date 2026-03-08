import { UserRoleEnum } from '@/enums/UserRoleEnum.ts'

export const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue'),
    meta: {
      access: [UserRoleEnum.ADMIN, UserRoleEnum.USER]
    }
  },
  {
    path: '/user/login',
    name: 'Login',
    component: () => import('@/pages/user/UserLoginPage.vue'),
  },
  {
    path: '/user/register',
    name: 'Register',
    component: () => import('@/pages/user/UserRegisterPage.vue'),
  },
  {
    path: '/user/manager',
    name: 'UserManager',
    component: () => import('@/pages/user/UserManagerPage.vue'),
    meta: {
      access: [UserRoleEnum.ADMIN]
    }
  }
]
