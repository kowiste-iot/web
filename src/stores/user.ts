// src/stores/user.ts
import { defineStore } from 'pinia'
import { User } from '@/domain/models/User'
import { Container } from '@/infra/di/container'
import type { UserService } from '@/domain/services/UserService'
import type { CreateUserParams, UpdateUserParams } from '@/domain/models/type'
import { ZodError } from 'zod'

interface State {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  validationErrors: Record<string, string> | null
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    validationErrors: null,
  }),

  getters: {
    adminUsers(): User[] {
      return this.users.filter((user) => user.canAccessAdmin())
    },

    getUserById() {
      return (id: number) => this.users.find((user) => user.id === id)
    },
  },

  actions: {
    getUserService(): UserService {
      return Container.getInstance().get<UserService>('userService')
    },

    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        this.users = await this.getUserService().getUsers()
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Failed to fetch users'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: number) {
      this.loading = true
      this.error = null

      try {
        const user = await this.getUserService().getUserById(id)
        if (user) {
          this.currentUser = user
        }
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : `Failed to fetch user ${id}`
        throw this.error
      } finally {
        this.loading = false
      }
    },

   async createUser(userData: CreateUserParams) {
      this.loading = true;
      this.error = null;
      this.validationErrors = null;

      try {
        const newUser = await this.getUserService().createUser(userData);
        this.users.push(newUser);
        return newUser;
      } catch (err) {
        if (err instanceof ZodError) {
          this.validationErrors = {};
          err.errors.forEach(error => {
            if (error.path) {
              this.validationErrors![error.path.join('.')] = error.message;
            }
          });
        } else {
          this.error = err instanceof Error ? err.message : 'Failed to create user';
        }
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: number, userData: UpdateUserParams) {
      this.loading = true;
      this.error = null;
      this.validationErrors = null;

      try {
        const updatedUser = await this.getUserService().updateUser(id, userData);
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        if (this.currentUser?.id === id) {
          this.currentUser = updatedUser;
        }
        return updatedUser;
      } catch (err) {
        if (err instanceof ZodError) {
          this.validationErrors = {};
          err.errors.forEach(error => {
            if (error.path) {
              this.validationErrors![error.path.join('.')] = error.message;
            }
          });
        } else {
          this.error = err instanceof Error ? err.message : 'Failed to update user';
        }
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      this.error = null

      try {
        await this.getUserService().deleteUser(id)
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

    async deactivateUser(id: number) {
      const user = this.users.find((u) => u.id === id)
      if (user) {
        user.deactivate()
        await this.updateUser(id, { isActive: false })
      }
    },
  },
})
