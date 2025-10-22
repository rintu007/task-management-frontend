<template>
  <nav class="bg-white shadow-sm border-b fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-semibold text-gray-900">
            Task Management System
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.to"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
          >
            {{ item.name }}
          </router-link>
          
          <div class="flex items-center space-x-2">
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
            <span 
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                authStore.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ authStore.isAdmin ? 'Admin' : 'User' }}
            </span>
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const navigation = [
  { name: 'Dashboard', to: '/' },
  { name: 'Tasks', to: '/tasks' },
  { name: 'Create Task', to: '/tasks/create' },
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>