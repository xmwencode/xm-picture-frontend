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
  },
  {
    path: '/picture/add',
    name: 'AddPicture',
    component: () => import('@/pages/picture/PictureHandlePage.vue'),
    meta: {
      access: [UserRoleEnum.ADMIN, UserRoleEnum.USER]
    }
  },
  {
    path: '/picture/detail/:id',
    name: 'PictureDetail',
    component: () => import('@/pages/picture/PictureDetailPage.vue'),
    props: true
  },
  {
    path: '/picture',
    name: 'PictureManagerBasic',
    component: () => import('@/pages/picture/PictureManagerBasicPage.vue'),
    redirect: '/picture/manager',
    meta: {
      access: [UserRoleEnum.ADMIN],
    },
    children: [
      {
        path: '/picture/manager',
        name: 'PictureManager',
        component: () => import('@/pages/picture/PictureManagerPage.vue'),
      },
      {
        path: '/category/manager',
        name: 'CategoryManager',
        component: () => import('@/pages/picture/CategoryManagerPage.vue'),
      },
      {
        path: '/tag/manager',
        name: 'TagManager',
        component: () => import('@/pages/picture/TagManagerPage.vue'),
      },
    ],
  },
]
