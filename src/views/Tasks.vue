<template>
  <div class="p-6">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Task Board</h1>
        <p class="text-gray-500 mt-1">Drag and drop tasks between columns to update their status</p>
      </div>
      <router-link
        to="/tasks/create"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        New Task
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search tasks..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="flex space-x-6 overflow-x-auto pb-6">
      <!-- Pending Column -->
      <div class="flex-1 min-w-80">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <h3 class="font-semibold text-gray-900">Pending</h3>
                <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  {{ pendingTasks.length }}
                </span>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
          <div 
            class="p-4 space-y-4 min-h-96 max-h-[calc(100vh-300px)] overflow-y-auto"
            @drop="handleDrop('pending')" 
            @dragover="handleDragOver"
            @dragenter="handleDragEnter"
          >
            <div
              v-for="task in pendingTasks"
              :key="task.id"
              draggable="true"
              @dragstart="handleDragStart(task)"
              @dragend="handleDragEnd"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-move task-card"
            >
              <div class="flex items-start justify-between mb-3">
                <h4 class="font-medium text-gray-900 text-sm">{{ task.title }}</h4>
                <div class="flex items-center space-x-1">
                  <router-link
                    :to="`/tasks/${task.id}/edit`"
                    v-if="authStore.canModifyTask(task)"
                    class="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                    @click.stop
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </router-link>
                  <button
                    v-if="authStore.canModifyTask(task)"
                    @click.stop="deleteTask(task)"
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <p class="text-gray-600 text-xs mb-3 line-clamp-2">{{ task.description }}</p>
              
              <div class="space-y-2">
                <div class="flex items-center text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>{{ task.user?.name }}</span>
                </div>
                
                <div v-if="task.due_date" class="flex items-center text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ formatDate(task.due_date) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="pendingTasks.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p class="text-gray-500 text-sm">No pending tasks</p>
            </div>
          </div>
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="flex-1 min-w-80">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 class="font-semibold text-gray-900">In Progress</h3>
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {{ inProgressTasks.length }}
                </span>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
          <div 
            class="p-4 space-y-4 min-h-96 max-h-[calc(100vh-300px)] overflow-y-auto"
            @drop="handleDrop('in_progress')" 
            @dragover="handleDragOver"
            @dragenter="handleDragEnter"
          >
            <div
              v-for="task in inProgressTasks"
              :key="task.id"
              draggable="true"
              @dragstart="handleDragStart(task)"
              @dragend="handleDragEnd"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-move task-card"
            >
              <div class="flex items-start justify-between mb-3">
                <h4 class="font-medium text-gray-900 text-sm">{{ task.title }}</h4>
                <div class="flex items-center space-x-1">
                  <router-link
                    :to="`/tasks/${task.id}/edit`"
                    v-if="authStore.canModifyTask(task)"
                    class="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                    @click.stop
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </router-link>
                  <button
                    v-if="authStore.canModifyTask(task)"
                    @click.stop="deleteTask(task)"
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <p class="text-gray-600 text-xs mb-3 line-clamp-2">{{ task.description }}</p>
              
              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>50%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 50%"></div>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>{{ task.user?.name }}</span>
                </div>
                
                <div v-if="task.due_date" class="flex items-center text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ formatDate(task.due_date) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="inProgressTasks.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p class="text-gray-500 text-sm">No tasks in progress</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Column -->
      <div class="flex-1 min-w-80">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 class="font-semibold text-gray-900">Completed</h3>
                <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {{ completedTasks.length }}
                </span>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
          <div 
            class="p-4 space-y-4 min-h-96 max-h-[calc(100vh-300px)] overflow-y-auto"
            @drop="handleDrop('completed')" 
            @dragover="handleDragOver"
            @dragenter="handleDragEnter"
          >
            <div
              v-for="task in completedTasks"
              :key="task.id"
              draggable="true"
              @dragstart="handleDragStart(task)"
              @dragend="handleDragEnd"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-move task-card"
            >
              <div class="flex items-start justify-between mb-3">
                <h4 class="font-medium text-gray-900 text-sm line-through">{{ task.title }}</h4>
                <div class="flex items-center space-x-1">
                  <router-link
                    :to="`/tasks/${task.id}/edit`"
                    v-if="authStore.canModifyTask(task)"
                    class="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                    @click.stop
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </router-link>
                  <button
                    v-if="authStore.canModifyTask(task)"
                    @click.stop="deleteTask(task)"
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <p class="text-gray-600 text-xs mb-3 line-clamp-2 line-through">{{ task.description }}</p>
              
              <div class="space-y-2">
                <div class="flex items-center text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>{{ task.user?.name }}</span>
                </div>
                
                <div v-if="task.due_date" class="flex items-center text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ formatDate(task.due_date) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="completedTasks.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-gray-500 text-sm">No completed tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="taskStore.isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-2">Loading tasks...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'

const taskStore = useTaskStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const draggedTask = ref(null)
const isDragging = ref(false)

// Computed properties for filtered tasks
const pendingTasks = computed(() => {
  return filterTasksByStatus('pending')
})

const inProgressTasks = computed(() => {
  return filterTasksByStatus('in_progress')
})

const completedTasks = computed(() => {
  return filterTasksByStatus('completed')
})

const filterTasksByStatus = (status) => {
  let tasks = taskStore.tasks.filter(task => task.status === status)
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    )
  }
  
  return tasks
}

// Drag and Drop handlers
const handleDragStart = (task) => {
  draggedTask.value = task
  isDragging.value = true
  setTimeout(() => {
    event.target.classList.add('opacity-50')
  }, 0)
}

const handleDragEnd = (event) => {
  isDragging.value = false
  event.target.classList.remove('opacity-50')
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const handleDragEnter = (event) => {
  event.preventDefault()
  if (isDragging.value) {
    event.currentTarget.classList.add('bg-blue-50', 'border-blue-200')
  }
}

const handleDragLeave = (event) => {
  event.currentTarget.classList.remove('bg-blue-50', 'border-blue-200')
}

const handleDrop = async (newStatus) => {
  if (draggedTask.value && draggedTask.value.status !== newStatus) {
    try {
      // Update task status locally first for instant feedback
      const originalStatus = draggedTask.value.status
      draggedTask.value.status = newStatus
      
      // Update task in backend
      await taskStore.updateTask(draggedTask.value.id, {
        title: draggedTask.value.title,
        description: draggedTask.value.description,
        status: newStatus,
        due_date: draggedTask.value.due_date
      })
    } catch (error) {
      // Revert local changes if API call fails
      draggedTask.value.status = originalStatus
      console.error('Failed to update task status:', error)
    }
  }
  
  // Remove drag styles
  document.querySelectorAll('.task-column').forEach(col => {
    col.classList.remove('bg-blue-50', 'border-blue-200')
  })
  
  draggedTask.value = null
}

onMounted(() => {
  taskStore.fetchTasks()
})

const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const deleteTask = async (task) => {
  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    try {
      await taskStore.deleteTask(task.id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for columns */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Drag and drop styles */
.task-card {
  transition: all 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
}

.task-card:active {
  transform: scale(0.98);
}

/* Horizontal scroll for board */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>