import { defineStore } from 'pinia'
import { User } from '../domain/User'
import { Container } from '@/shared/di/container'
import type { CreateUserParams, UpdateUserParams } from '../domain/types'
import type { UserRepository } from '../infra/UserRepository'

interface State {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  }),

  getters: {
    adminUsers(): User[] {
      return this.users.filter((user) => user.canAccessAdmin())
    },
  },

  actions: {
    getUserService() {
      return Container.getInstance().get<UserRepository>('userRepository')
    },

    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        this.users = await this.getUserService().findAll()
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Failed to fetch users'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async createUser(params: CreateUserParams) {
      this.loading = true
      this.error = null

      try {
        const user = await this.getUserService().create(params)
        this.users.push(user)
        return user
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Failed to create user'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, params: UpdateUserParams) {
      this.loading = true
      this.error = null

      try {
        const user = await this.getUserService().update(id, params)
        const index = this.users.findIndex((u) => u.id === id)
        if (index !== -1) {
          this.users[index] = user
        }
        if (this.currentUser?.id === id) {
          this.currentUser = user
        }
        return user
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Failed to update user'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      this.error = null

      try {
        await this.getUserService().delete(id)
        this.users = this.users.filter((user) => user.id !== id)
        if (this.currentUser?.id === id) {
          this.currentUser = null
        }
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Failed to delete user'
        throw this.error
      } finally {
        this.loading = false
      }
    },
  },
})
