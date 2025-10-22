import { defineStore } from 'pinia'
import { taskService } from '@/services/api'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    currentTask: null,
    isLoading: false,
    filters: {
      status: '',
    },
  }),

  getters: {
    filteredTasks: (state) => {
      let tasks = state.tasks
      
      if (state.filters.status) {
        tasks = tasks.filter(task => task.status === state.filters.status)
      }
      
      return tasks
    },
    
    tasksByStatus: (state) => {
      return state.tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = []
        }
        acc[task.status].push(task)
        return acc
      }, {})
    },
  },

  actions: {
    async fetchTasks(filters = {}) {
      this.isLoading = true
      try {
        const response = await taskService.getTasks(filters)
        this.tasks = response.data.data
        this.filters = { ...this.filters, ...filters }
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchTask(id) {
      this.isLoading = true
      try {
        const response = await taskService.getTask(id)
        this.currentTask = response.data.data
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createTask(taskData) {
      try {
        const response = await taskService.createTask(taskData)
        this.tasks.unshift(response.data.data)
        return response.data.data
      } catch (error) {
        throw error
      }
    },

    async updateTask(id, taskData) {
      try {
        const response = await taskService.updateTask(id, taskData)
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data.data
        }
        return response.data.data
      } catch (error) {
        throw error
      }
    },

    async deleteTask(id) {
      try {
        await taskService.deleteTask(id)
        this.tasks = this.tasks.filter(task => task.id !== id)
      } catch (error) {
        throw error
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
  },
})