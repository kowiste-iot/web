// src/features/users/presentation/UserList.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/features/user/stores/store';
import { UserForm } from '@/features/user/domain/forms/UserForm';
import { UserUpdateForm } from '@/features/user/domain/forms/UserUpdateForm';
import { UserRole } from '@/features/user/domain/types';
import type { User } from '@/features/user/domain/User';

const userStore = useUserStore();
const userForm = ref(new UserForm());
const updateForm = ref<UserUpdateForm>(new UserUpdateForm());
const editingUser = ref<User | null>(null);

onMounted(async () => {
  try {
    await userStore.fetchUsers();
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
});

const handleSubmit = async () => {
  const params = userForm.value.toCreateParams();
  if (!params) return;

  try {
    await userStore.createUser(params);
    userForm.value = new UserForm(); // Reset form
  } catch (error) {
    console.error('Failed to create user:', error);
  }
};

const startEdit = (user: User) => {
  editingUser.value = user;
  updateForm.value = new UserUpdateForm();
  updateForm.value.fromUser(user);
};

const handleUpdate = async () => {
  if (!editingUser.value) return;

  const params = updateForm.value.toUpdateParams();
  if (!params) return;

  try {
    await userStore.updateUser(editingUser.value.id, params);
    editingUser.value = null;
    updateForm.value = new UserUpdateForm();
  } catch (error) {
    console.error('Failed to update user:', error);
  }
};

const handleDelete = async (userId: number) => {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    await userStore.deleteUser(userId);
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};
</script>

<template>
  <div class="container py-4">
    <!-- Create User Form -->
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="card-title h4 mb-4">Create New User</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input
              v-model="userForm.name"
              type="text"
              class="form-control"
            />
            <div class="form-text text-danger">{{ userForm.getError('name') }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              v-model="userForm.email"
              type="email"
              class="form-control"
            />
            <div class="form-text text-danger">{{ userForm.getError('email') }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label">Role</label>
            <select v-model="userForm.role" class="form-select">
              <option :value="UserRole.USER">User</option>
              <option :value="UserRole.ADMIN">Admin</option>
              <option :value="UserRole.GUEST">Guest</option>
            </select>
            <div class="form-text text-danger">{{ userForm.getError('role') }}</div>
          </div>

          <div class="mb-3 form-check">
            <input
              v-model="userForm.isActive"
              type="checkbox"
              class="form-check-input"
              id="isActive"
            />
            <label class="form-check-label" for="isActive">Active</label>
            <div class="form-text text-danger">{{ userForm.getError('isActive') }}</div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="userForm.hasErrors()"
          >
            Create User
          </button>
        </form>
      </div>
    </div>

    <!-- User List -->
    <div class="card">
      <div class="card-body">
        <h2 class="card-title h4 mb-4">Users</h2>
        
        <div v-if="userStore.loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="userStore.error" class="alert alert-danger text-center" role="alert">
          {{ userStore.error }}
        </div>
        
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in userStore.users" :key="user.id">
                <!-- View Mode -->
                <template v-if="editingUser?.id !== user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                  <td>
                    <span
                      :class="user.isActive ? 'text-success' : 'text-danger'"
                    >
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        @click="startEdit(user)"
                        class="btn btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        @click="handleDelete(user.id)"
                        class="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </template>

                <!-- Edit Mode -->
                <template v-else>
                  <td colspan="5">
                    <form @submit.prevent="handleUpdate" class="py-2">
                      <div class="row g-2">
                        <div class="col">
                          <input
                            v-model="updateForm.name"
                            type="text"
                            placeholder="Name"
                            class="form-control form-control-sm"
                          />
                        </div>
                        <div class="col">
                          <input
                            v-model="updateForm.email"
                            type="email"
                            placeholder="Email"
                            class="form-control form-control-sm"
                          />
                        </div>
                        <div class="col">
                          <select
                            v-model="updateForm.role"
                            class="form-select form-select-sm"
                          >
                            <option :value="UserRole.USER">User</option>
                            <option :value="UserRole.ADMIN">Admin</option>
                            <option :value="UserRole.GUEST">Guest</option>
                          </select>
                        </div>
                        <div class="col-auto">
                          <div class="form-check">
                            <input
                              v-model="updateForm.isActive"
                              type="checkbox"
                              class="form-check-input"
                              id="updateIsActive"
                            />
                            <label class="form-check-label" for="updateIsActive">Active</label>
                          </div>
                        </div>
                        <div class="col-auto">
                          <div class="btn-group btn-group-sm">
                            <button
                              type="submit"
                              class="btn btn-success"
                              :disabled="updateForm.hasErrors()"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              @click="editingUser = null"
                              class="btn btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                      <!-- Validation Errors -->
                      <div v-if="updateForm.hasErrors()" class="mt-2">
                        <div v-if="updateForm.getError('name')" class="form-text text-danger">
                          {{ updateForm.getError('name') }}
                        </div>
                        <div v-if="updateForm.getError('email')" class="form-text text-danger">
                          {{ updateForm.getError('email') }}
                        </div>
                        <div v-if="updateForm.getError('role')" class="form-text text-danger">
                          {{ updateForm.getError('role') }}
                        </div>
                      </div>
                    </form>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>