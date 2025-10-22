<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-900">Edit Task</h2>
        </div>
        
        <div class="p-6">
          <div v-if="taskStore.isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <form v-else @submit.prevent="handleSubmit">
            <div class="space-y-6">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div v-if="errors.title" class="text-red-600 text-sm mt-1">
                  {{ errors.title }}
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <div v-if="errors.description" class="text-red-600 text-sm mt-1">
                  {{ errors.description }}
                </div>
              </div>

              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div v-if="errors.status" class="text-red-600 text-sm mt-1">
                  {{ errors.status }}
                </div>
              </div>

              <div>
                <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  id="due_date"
                  v-model="form.due_date"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div v-if="errors.due_date" class="text-red-600 text-sm mt-1">
                  {{ errors.due_date }}
                </div>
              </div>

              <div v-if="submitError" class="text-red-600 text-sm text-center">
                {{ submitError }}
              </div>

              <div class="flex justify-end space-x-4 pt-4">
                <router-link
                  to="/tasks"
                  class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </router-link>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <span v-if="isSubmitting">Updating...</span>
                  <span v-else>Update Task</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'

const taskStore = useTaskStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const isSubmitting = ref(false)
const submitError = ref('')

const form = ref({
  title: '',
  description: '',
  status: 'pending',
  due_date: '',
})

const errors = ref({
  title: '',
  description: '',
  status: '',
  due_date: '',
})

const taskId = parseInt(route.params.id)

onMounted(async () => {
  try {
    await taskStore.fetchTask(taskId)
    
    // Check if user can modify this task
    if (taskStore.currentTask && !authStore.canModifyTask(taskStore.currentTask)) {
      router.push('/tasks')
      return
    }

    // Populate form with current task data
    if (taskStore.currentTask) {
      form.value = {
        title: taskStore.currentTask.title,
        description: taskStore.currentTask.description,
        status: taskStore.currentTask.status,
        due_date: taskStore.currentTask.due_date 
          ? new Date(taskStore.currentTask.due_date).toISOString().slice(0, 16)
          : '',
      }
    }
  } catch (error) {
    console.error('Failed to fetch task:', error)
    router.push('/tasks')
  }
})

const validateForm = () => {
  let isValid = true
  errors.value = { title: '', description: '', status: '', due_date: '' }

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
    isValid = false
  }

  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
    isValid = false
  }

  if (form.value.due_date && new Date(form.value.due_date) < new Date()) {
    errors.value.due_date = 'Due date must be in the future'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    await taskStore.updateTask(taskId, form.value)
    router.push('/tasks')
  } catch (error) {
    if (error.response?.data?.errors) {
      const apiErrors = error.response.data.errors
      Object.keys(apiErrors).forEach(key => {
        if (key in errors.value) {
          errors.value[key] = apiErrors[key][0]
        }
      })
    } else {
      submitError.value = error.response?.data?.message || 'Failed to update task'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>