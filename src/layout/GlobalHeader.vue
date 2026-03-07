<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { type MenuProps, message } from 'ant-design-vue'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { convertMenuConfigToAntdItems, menuItems } from '@/config/menuConfig.ts'
import { useUserStore } from '@/stores/user.ts'
import { userLogoutApi } from '@/api'

const router = useRouter()
const userStore = useUserStore()

// 当前选中菜单
const selectedKey = ref<string[]>(['/'])
// 监听路由
router.afterEach((to) => {
  selectedKey.value = [to.path]
})

// 菜单配置转换为 antd 菜单配置
const antdMenuItems = computed(() => {
  return convertMenuConfigToAntdItems(menuItems)
})

// 处理菜单点击事件
const handleMenuClick: MenuProps['onClick'] = (e) => {
  const key = e.key as string
  // 跳转到对应路由
  router.push(key)
}

// 退出登录
const doLogout = async () => {
  const res = await userLogoutApi()
  if (res.data) {
    userStore.removeToken()
    userStore.removeUserInfo()
    await router.push('/user/login')
    message.success('已退出登录')
  }
}

// 自动登录
const autoLogin = () => {
  if (userStore.token && !userStore.loginUser.id) {
    try {
      userStore.fetchLoginUser()
    } catch (error) {}
  }
}

onMounted(() => {
  autoLogin()
})

</script>

<template>
  <a-layout-header class="global-header">
    <a-row :wrap="false">
      <!-- 左侧： logo 与 标题 -->
      <a-col flex="300px">
        <div class="logo-wrapper">
          <span class="logo">浔</span>
          <span class="title">浔梦智能协同云图库</span>
        </div>
      </a-col>
      <!-- 中间：导航菜单 -->
      <a-col flex="auto">
        <a-menu
          :selected-keys="selectedKey"
          mode="horizontal"
          :items="antdMenuItems"
          @click="handleMenuClick"
        />
      </a-col>
      <!-- 右侧：用户操作区域 -->
      <a-col flex="100px">
        <div class="user-login-status">
          <div v-if="userStore.loginUser.id" class="user-info">
            <a-dropdown>
              <a-space>
                <a-avatar :src="userStore.loginUser.avatar">
                  {{ userStore.loginUser.avatar ?? (userStore.loginUser.username?.charAt(0)?.toUpperCase()) }}
                </a-avatar>
                {{ userStore.loginUser.nickname ?? '无名' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <a-button v-else type="primary" @click="$router.push('/user/login')">登录 </a-button>
        </div>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<style scoped>
.global-header {
  background-color: #fff;
  padding: 0 36px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #69c0ff 0%, #40a9ff 100%);
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(64, 169, 255, 0.3);
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #40a9ff;
  letter-spacing: 1px;
}

.ant-menu-horizontal {
  border-bottom: none !important;
}
</style>
