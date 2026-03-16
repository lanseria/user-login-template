<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

definePageMeta({
  middleware: 'admin',
})

const users = ref<any[]>([])
const isLoading = ref(false)

const showModal = ref(false)
const isEditing = ref(false)
const modalError = ref('')
const isSubmitting = ref(false)

const form = reactive({
  id: 0,
  username: '',
  password: '',
  role: 'user' as 'admin' | 'user',
})

async function fetchUsers() {
  isLoading.value = true
  try {
    const data = await $fetch('/api/admin/users')
    users.value = data
  }
  catch (e) {
    console.error('Failed to fetch users', e)
  }
  finally {
    isLoading.value = false
  }
}

function openCreate() {
  isEditing.value = false
  form.username = ''
  form.password = ''
  form.role = 'user'
  modalError.value = ''
  showModal.value = true
}

function openEdit(user: any) {
  isEditing.value = true
  form.id = user.id
  form.username = user.username
  form.password = ''
  form.role = user.role
  modalError.value = ''
  showModal.value = true
}

async function handleSubmit() {
  if (!isEditing.value && !form.username)
    return

  isSubmitting.value = true
  modalError.value = ''

  try {
    if (isEditing.value) {
      await $fetch(`/api/admin/users/${form.id}`, {
        method: 'PUT',
        body: {
          password: form.password || undefined,
          role: form.role,
        },
      })
    }
    else {
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: {
          username: form.username,
          password: form.password,
          role: form.role,
        },
      })
    }
    showModal.value = false
    await fetchUsers()
  }
  catch (e: any) {
    modalError.value = e.data?.message || '操作失败'
  }
  finally {
    isSubmitting.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确定要删除该用户吗？此操作不可恢复。'))
    return

  try {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    await fetchUsers()
  }
  catch (e: any) {
    alert(e.data?.message || '删除失败')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="mx-auto py-8 max-w-5xl animate-fade-in">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl text-gray-900 font-bold dark:text-white">
          用户管理
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          管理系统访问权限与账号
        </p>
      </div>
      <button class="btn gap-2" @click="openCreate">
        <div class="i-carbon-user-follow" />
        添加用户
      </button>
    </div>

    <div class="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-800">
      <div class="overflow-x-auto">
        <table class="text-sm text-left w-full">
          <thead class="text-gray-500 font-medium border-b border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3">
                用户
              </th>
              <th class="px-6 py-3">
                角色
              </th>
              <th class="px-6 py-3">
                注册时间
              </th>
              <th class="px-6 py-3 text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-gray-100 divide-y dark:divide-gray-700/50">
            <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4">
                <div class="flex gap-3 items-center">
                  <div class="text-primary rounded-full bg-primary/10 flex h-8 w-8 items-center justify-center">
                    <div class="i-carbon-user" />
                  </div>
                  <span class="text-gray-900 font-medium dark:text-white">{{ user.username }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-xs font-medium px-2.5 py-0.5 border rounded-full"
                  :class="user.role === 'admin'
                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                    : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'"
                >
                  {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </td>
              <td class="text-gray-500 px-6 py-4 dark:text-gray-400">
                {{ useDateFormat(user.createdAt, 'YYYY-MM-DD HH:mm').value }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex gap-2 justify-end">
                  <button
                    class="text-gray-400 p-1 transition-colors hover:text-primary"
                    title="编辑"
                    @click="openEdit(user)"
                  >
                    <div class="i-carbon-edit text-lg" />
                  </button>
                  <button
                    class="text-gray-400 p-1 transition-colors hover:text-red-500"
                    title="删除"
                    @click="handleDelete(user.id)"
                  >
                    <div class="i-carbon-trash-can text-lg" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0 && !isLoading">
              <td colspan="4" class="text-gray-400 py-8 text-center">
                暂无用户数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="p-4 flex items-center inset-0 justify-center fixed z-50">
      <div class="bg-black/50 inset-0 absolute backdrop-blur-sm" @click="showModal = false" />
      <div class="p-6 rounded-xl bg-white max-w-md w-full shadow-2xl relative dark:border dark:border-gray-700 dark:bg-gray-800">
        <h3 class="text-lg font-bold mb-6 flex gap-2 items-center dark:text-white">
          <div :class="isEditing ? 'i-carbon-edit' : 'i-carbon-user-follow'" class="text-primary" />
          {{ isEditing ? '编辑用户' : '新建用户' }}
        </h3>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="text-sm text-gray-700 font-medium mb-1 block dark:text-gray-300">用户名</label>
            <input
              v-model="form.username"
              type="text"
              class="input-base"
              :disabled="isEditing"
              :class="{ 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900': isEditing }"
              placeholder="请输入用户名"
              required
            >
            <p v-if="isEditing" class="text-xs text-gray-400 mt-1">
              用户名不可修改
            </p>
          </div>

          <div>
            <label class="text-sm text-gray-700 font-medium mb-1 block dark:text-gray-300">
              {{ isEditing ? '重置密码' : '密码' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              class="input-base"
              :placeholder="isEditing ? '留空则保持原密码不变' : '请输入密码'"
              :required="!isEditing"
              minlength="6"
            >
          </div>

          <div>
            <label class="text-sm text-gray-700 font-medium mb-1 block dark:text-gray-300">角色</label>
            <div class="mt-2 flex gap-4">
              <label class="flex gap-2 cursor-pointer items-center">
                <input v-model="form.role" type="radio" value="user" class="text-primary focus:ring-primary">
                <span class="text-sm text-gray-700 dark:text-gray-300">普通用户</span>
              </label>
              <label class="flex gap-2 cursor-pointer items-center">
                <input v-model="form.role" type="radio" value="admin" class="text-primary focus:ring-primary">
                <span class="text-sm text-gray-700 dark:text-gray-300">管理员</span>
              </label>
            </div>
          </div>

          <div v-if="modalError" class="text-sm text-red-600 p-3 rounded-lg bg-red-50 flex gap-2 items-center dark:text-red-400 dark:bg-red-900/20">
            <div class="i-carbon-warning-filled shrink-0" />
            {{ modalError }}
          </div>

          <div class="mt-6 pt-2 flex gap-3 justify-end">
            <button type="button" class="btn text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-200" @click="showModal = false">
              取消
            </button>
            <button type="submit" class="btn" :disabled="isSubmitting">
              <div v-if="isSubmitting" class="i-carbon-circle-dash animate-spin" />
              {{ isEditing ? '保存修改' : '立即创建' }}
            </button>
          </div>
        </form>
      </div>
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
