import { defineStore } from 'pinia'
import { authService } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('auth_token'),
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role?.name === 'Admin',
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      try {
        const response = await authService.login(credentials)
        this.token = response.data.access_token
        this.user = response.data.user
        
        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      try {
        const response = await authService.register(userData)
        this.token = response.data.access_token
        this.user = response.data.user
        
        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    },

    async fetchUser() {
      try {
        const response = await authService.getUser()
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        this.logout()
        throw error
      }
    },

    canModifyTask(task) {
      return this.isAdmin || this.user?.id === task.user_id
    },
  },
})