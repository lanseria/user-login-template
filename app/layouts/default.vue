<script setup lang="ts">
import { appName } from '~/constants'

const authStore = useAuthStore()
const colorMode = useColorMode()

const isUserMenuOpen = ref(false)
const userMenuRef = ref(null)

onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
})

function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handleLogout() {
  isUserMenuOpen.value = false
  authStore.logout()
}
</script>

<template>
  <main class="text-gray-800 font-sans bg-gray-50 min-h-screen dark:text-gray-200 dark:bg-gray-900">
    <header class="px-6 border-b border-gray-200 bg-white/80 flex h-16 items-center top-0 justify-between sticky z-40 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div class="flex gap-3 items-center">
        <div class="text-white rounded-lg bg-primary flex h-8 w-8 items-center justify-center">
          <div class="i-carbon-user text-lg" />
        </div>
        <NuxtLink to="/" class="text-lg tracking-tight font-bold">
          {{ appName }}
        </NuxtLink>
      </div>
      <div v-if="authStore.isAuthenticated" class="flex gap-4 items-center">
        <div ref="userMenuRef" class="relative">
          <button
            class="px-3 py-1.5 border border-gray-200 rounded-full flex gap-2 transition-all items-center hover:text-primary dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:border-primary/50 dark:hover:bg-primary/10"
            :class="{ 'border-primary text-primary bg-primary/5': isUserMenuOpen }"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <div class="rounded-full bg-gray-100 flex h-6 w-6 items-center justify-center dark:bg-gray-800">
              <div class="i-carbon-user text-xs opacity-70" />
            </div>
            <span class="font-medium">欢迎, {{ authStore.user?.username }}</span>
            <div class="i-carbon-chevron-down text-xs transition-transform duration-200" :class="{ 'rotate-180': isUserMenuOpen }" />
          </button>

          <Transition name="fade">
            <div
              v-if="isUserMenuOpen"
              class="mt-2 border rounded-md bg-white min-w-56 shadow-lg right-0 top-full absolute z-50 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="py-1">
                <NuxtLink
                  to="/account"
                  class="text-sm px-4 py-2.5 text-left flex gap-3 w-full transition-colors items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="isUserMenuOpen = false"
                >
                  <div class="i-carbon-user-avatar text-lg text-gray-500" />
                  <span>个人中心</span>
                </NuxtLink>

                <NuxtLink
                  v-if="authStore.isAdmin"
                  to="/admin/users"
                  class="text-sm px-4 py-2.5 text-left flex gap-3 w-full transition-colors items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="isUserMenuOpen = false"
                >
                  <div class="i-carbon-user-settings text-lg text-gray-500" />
                  <span>用户管理</span>
                </NuxtLink>

                <button
                  class="text-sm px-4 py-2.5 text-left flex gap-3 w-full transition-colors items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="toggleDark()"
                >
                  <div class="i-carbon-sun dark:i-carbon-moon text-lg text-gray-500" />
                  <span>{{ colorMode.value === 'dark' ? '切换亮色' : '切换深色' }}</span>
                </button>

                <div class="my-1 border-t dark:border-gray-700" />

                <button
                  class="text-sm text-red-600 px-4 py-2.5 text-left flex gap-3 w-full transition-colors items-center dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  @click="handleLogout()"
                >
                  <div i-carbon-logout class="text-lg" />
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </header>
    <div class="mx-auto w-full">
      <slot />
    </div>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
