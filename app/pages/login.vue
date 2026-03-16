<script setup lang="ts">
import { appName } from '~/constants'

definePageMeta({
  layout: 'blank',
})

useHead({
  title: `登录 - ${appName}`,
})

const authStore = useAuthStore()

const rememberMe = useLocalStorage('auth-remember', false)
const savedUsername = useLocalStorage('auth-username', '')
const savedPassword = useLocalStorage('auth-password', '')

const credentials = reactive({
  username: rememberMe.value ? savedUsername.value : '',
  password: rememberMe.value ? savedPassword.value : '',
})

const isLoading = ref(false)
const errorMessage = ref('')

if (authStore.isAuthenticated) {
  navigateTo('/')
}

async function handleLogin() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await authStore.login(credentials)

    if (rememberMe.value) {
      savedUsername.value = credentials.username
      savedPassword.value = credentials.password
    }
    else {
      savedUsername.value = ''
      savedPassword.value = ''
    }
  }
  catch (error: any) {
    errorMessage.value = error.data?.message || '登录时发生未知错误，请重试。'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white flex min-h-screen dark:bg-gray-950">
    <div class="p-12 bg-gray-50 w-1/2 hidden items-center justify-center relative overflow-hidden dark:bg-gray-900 lg:flex">
      <div class="opacity-50 inset-0 absolute from-primary-50 to-white bg-gradient-to-br dark:from-gray-900 dark:to-gray-800" />
      <div class="rounded-full bg-primary-200/30 h-96 w-96 absolute blur-3xl dark:bg-primary-900/20 -left-24 -top-24" />
      <div class="rounded-full bg-primary-100/40 h-[500px] w-[500px] bottom-0 right-0 absolute blur-3xl dark:bg-primary-800/10" />

      <div class="text-center max-w-lg relative z-10">
        <div class="mb-8 flex justify-center">
          <div class="rounded-2xl bg-white flex h-24 w-24 shadow-xl items-center justify-center dark:bg-gray-800">
            <div class="i-carbon-user text-5xl text-primary" />
          </div>
        </div>
        <h2 class="text-3xl text-gray-900 font-bold mb-4 dark:text-white">
          用户登录与权限管理系统
        </h2>
        <p class="text-lg text-gray-500 leading-relaxed dark:text-gray-400">
          安全、简洁、高效的用户认证模板。{{ appName }} 为您提供完整的登录、权限管理和用户管理功能。
        </p>
      </div>
    </div>

    <div class="p-6 flex w-full items-center justify-center sm:p-12 lg:w-1/2">
      <div class="max-w-md w-full space-y-8">
        <div class="mb-8 text-center lg:hidden">
          <div class="mb-4 rounded-xl bg-primary-50 inline-flex h-16 w-16 items-center justify-center dark:bg-gray-800">
            <div class="i-carbon-user text-3xl text-primary" />
          </div>
          <h1 class="text-2xl text-gray-900 font-bold dark:text-white">
            {{ appName }}
          </h1>
        </div>

        <div class="text-center lg:text-left">
          <h2 class="text-2xl text-gray-900 tracking-tight font-bold dark:text-white">
            登录账户
          </h2>
          <p class="text-sm text-gray-500 mt-2 dark:text-gray-400">
            请输入您的管理员或员工账号以继续
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <div>
              <label for="username" class="text-sm text-gray-700 font-medium mb-1.5 block dark:text-gray-300">用户名</label>
              <div class="relative">
                <div class="pl-3 flex pointer-events-none items-center inset-y-0 left-0 absolute">
                  <div class="i-carbon-user text-gray-400" />
                </div>
                <input
                  id="username"
                  v-model="credentials.username"
                  type="text"
                  required
                  class="input-base pl-10"
                  placeholder="admin"
                  autocomplete="username"
                >
              </div>
            </div>

            <div>
              <label for="password" class="text-sm text-gray-700 font-medium mb-1.5 block dark:text-gray-300">密码</label>
              <div class="relative">
                <div class="pl-3 flex pointer-events-none items-center inset-y-0 left-0 absolute">
                  <div class="i-carbon-locked text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="credentials.password"
                  type="password"
                  required
                  class="input-base pl-10"
                  placeholder="••••••••"
                  autocomplete="current-password"
                >
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="group flex gap-2 cursor-pointer items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="text-primary border-gray-300 rounded h-4 w-4 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary dark:checked:bg-primary"
              >
              <span class="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300">记住我</span>
            </label>
          </div>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="errorMessage" class="p-3 rounded-md bg-red-50 flex gap-2 items-start dark:bg-red-900/20">
              <div class="i-carbon-warning-filled text-red-500 mt-0.5 shrink-0" />
              <p class="text-sm text-red-600 dark:text-red-400">
                {{ errorMessage }}
              </p>
            </div>
          </Transition>

          <button
            type="submit"
            class="btn font-semibold py-2.5 w-full shadow-md transform transition-all hover:shadow-lg active:scale-[0.98]"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="i-carbon-circle-dash text-xl animate-spin" />
            <span v-else>立即登录</span>
          </button>
        </form>

        <p class="text-xs text-gray-400 mt-8 text-center">
          &copy; {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>
