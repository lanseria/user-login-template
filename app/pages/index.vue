<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div class="mx-auto px-4 py-12 max-w-4xl">
    <div class="text-center">
      <div class="mb-6 inline-flex">
        <div class="text-white rounded-2xl bg-primary flex h-20 w-20 shadow-xl items-center justify-center">
          <div class="i-carbon-home text-4xl" />
        </div>
      </div>
      <h1 class="text-4xl text-gray-900 font-bold mb-4 dark:text-white">
        欢迎回来！
      </h1>
      <p class="text-lg text-gray-500 mb-8 dark:text-gray-400">
        您已成功登录用户登录模板系统。
      </p>

      <div class="p-8 border border-gray-200 rounded-2xl bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="flex gap-4 items-center justify-center">
          <div class="text-primary rounded-full bg-primary/10 flex h-16 w-16 items-center justify-center">
            <div class="i-carbon-user text-2xl" />
          </div>
          <div class="text-left">
            <div class="text-xl text-gray-900 font-semibold dark:text-white">
              {{ authStore.user?.username }}
            </div>
            <div class="mt-1 flex gap-2 items-center">
              <span
                class="text-xs font-medium px-2 py-0.5 border rounded"
                :class="authStore.user?.role === 'admin'
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                  : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'"
              >
                {{ authStore.user?.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                用户 ID: {{ authStore.user?.id }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex gap-4 justify-center">
        <NuxtLink to="/account" class="btn">
          <div class="i-carbon-user-avatar" />
          个人中心
        </NuxtLink>
        <NuxtLink
          v-if="authStore.isAdmin"
          to="/admin/users"
          class="btn"
        >
          <div class="i-carbon-user-settings" />
          用户管理
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
