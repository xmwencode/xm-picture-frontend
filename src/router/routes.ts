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
  },
  {
    path: '/user/login',
    name: 'Login',
    component: () => import('@/pages/UserLoginPage.vue'),
  },
  {
    path: '/user/register',
    name: 'Register',
    component: () => import('@/pages/UserRegisterPage.vue'),
  }
]
