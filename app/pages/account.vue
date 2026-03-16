<script setup lang="ts">
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isLoading = ref(false)
const message = ref<{ type: 'success' | 'error', text: string } | null>(null)

async function handleChangePassword() {
  message.value = null

  if (form.newPassword !== form.confirmPassword) {
    message.value = { type: 'error', text: '两次输入的新密码不一致' }
    return
  }

  if (form.newPassword.length < 6) {
    message.value = { type: 'error', text: '新密码至少需要6个字符' }
    return
  }

  isLoading.value = true
  try {
    await $fetch('/api/auth/password', {
      method: 'PUT',
      body: {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      },
    })

    message.value = { type: 'success', text: '密码修改成功' }
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  }
  catch (e: any) {
    message.value = { type: 'error', text: e.data?.message || '修改失败，请重试' }
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto px-4 py-10 max-w-2xl animate-fade-in">
    <h1 class="text-2xl text-gray-900 font-bold mb-2 dark:text-white">
      个人中心
    </h1>
    <p class="text-gray-500 mb-8 dark:text-gray-400">
      管理您的个人资料和安全设置
    </p>

    <div class="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg text-gray-800 font-bold mb-4 flex gap-2 items-center dark:text-white">
        <div class="i-carbon-user-profile text-primary" />
        基本信息
      </h2>
      <div class="flex gap-4 items-center">
        <div class="text-3xl text-gray-400 rounded-full bg-gray-100 flex h-16 w-16 items-center justify-center dark:bg-gray-700">
          <div class="i-carbon-user" />
        </div>
        <div>
          <div class="text-lg text-gray-900 font-medium dark:text-white">
            {{ user?.username }}
          </div>
          <div class="mt-1 flex gap-2 items-center">
            <span
              class="text-xs font-medium px-2 py-0.5 border rounded"
              :class="user?.role === 'admin'
                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'"
            >
              {{ user?.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ user?.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6 border border-gray-200 rounded-xl bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg text-gray-800 font-bold mb-6 flex gap-2 items-center dark:text-white">
        <div class="i-carbon-password text-primary" />
        修改密码
      </h2>

      <form class="max-w-md space-y-5" @submit.prevent="handleChangePassword">
        <div>
          <label class="text-sm text-gray-700 font-medium mb-1 block dark:text-gray-300">当前密码</label>
          <input
            v-model="form.oldPassword"
            type="password"
            required
            class="input-base"
            placeholder="请输入当前使用的密码"
          >
        </div>

        <div>
          <label class="text-sm text-gray-700 font-medium mb-1 block dark:text-gray-300">新密码</label>
          <input
            v-model="form.newPassword"
            type="password"
            required
            minlength="6"
            class="input-base"
            placeholder="至少 6 位字符"
          >
        </div>

        <div>
          <label class="text-sm text-gray-700 font-medium mb-1 block dark:text-gray-300">确认新密码</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="input-base"
            placeholder="请再次输入新密码"
          >
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="message"
            class="text-sm p-3 rounded-lg flex gap-2 items-center"
            :class="message.type === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'"
          >
            <div :class="message.type === 'success' ? 'i-carbon-checkmark-filled' : 'i-carbon-warning-filled'" />
            {{ message.text }}
          </div>
        </Transition>

        <div class="pt-2">
          <button
            type="submit"
            class="btn w-full sm:w-auto"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="i-carbon-circle-dash animate-spin" />
            确认修改
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
