<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ pageDescription }}</p>
      </div>

      <!-- Header Actions - Profile at Top Right -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- User Profile -->
        <div class="flex items-center space-x-3">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.role?.name }}</p>
          </div>
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ authStore.user?.name?.charAt(0) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const route = useRoute()

const pageTitles = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Task Management',
  '/tasks/create': 'Create New Task',
  '/tasks/:id/edit': 'Edit Task',
  '/calendar': 'Calendar'
}

const pageDescriptions = {
  '/': 'Overview of your tasks and progress',
  '/projects': 'Manage your projects and teams',
  '/tasks': 'Manage and track all your tasks',
  '/tasks/create': 'Add a new task to your list',
  '/tasks/:id/edit': 'Update task details',
  '/calendar': 'View your tasks and deadlines in calendar view'
}

const pageTitle = computed(() => {
  return pageTitles[route.path] || 'Task Management'
})

const pageDescription = computed(() => {
  return pageDescriptions[route.path] || 'Manage your tasks efficiently'
})
</script>