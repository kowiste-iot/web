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
  <div class="container mx-auto p-4">
    <!-- Create User Form -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Create New User</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-1">Name</label>
          <input
            v-model="userForm.name"
            type="text"
            class="w-full p-2 border rounded"
          />
          <span class="text-red-500 text-sm">{{ userForm.getError('name') }}</span>
        </div>

        <div>
          <label class="block mb-1">Email</label>
          <input
            v-model="userForm.email"
            type="email"
            class="w-full p-2 border rounded"
          />
          <span class="text-red-500 text-sm">{{ userForm.getError('email') }}</span>
        </div>

        <div>
          <label class="block mb-1">Role</label>
          <select v-model="userForm.role" class="w-full p-2 border rounded">
            <option :value="UserRole.USER">User</option>
            <option :value="UserRole.ADMIN">Admin</option>
            <option :value="UserRole.GUEST">Guest</option>
          </select>
          <span class="text-red-500 text-sm">{{ userForm.getError('role') }}</span>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="userForm.isActive"
            type="checkbox"
            id="isActive"
          />
          <label for="isActive">Active</label>
          <span class="text-red-500 text-sm">{{ userForm.getError('isActive') }}</span>
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="userForm.hasErrors()"
        >
          Create User
        </button>
      </form>
    </div>

    <!-- User List -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Users</h2>
      
      <div v-if="userStore.loading" class="text-center py-4">
        Loading...
      </div>
      
      <div v-else-if="userStore.error" class="text-red-500 text-center py-4">
        {{ userStore.error }}
      </div>
      
      <div v-else>
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left py-2">Name</th>
              <th class="text-left py-2">Email</th>
              <th class="text-left py-2">Role</th>
              <th class="text-left py-2">Status</th>
              <th class="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userStore.users" :key="user.id">
              <!-- View Mode -->
              <template v-if="editingUser?.id !== user.id">
                <td class="py-2">{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <span
                    :class="user.isActive ? 'text-green-500' : 'text-red-500'"
                  >
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="space-x-2">
                  <button
                    @click="startEdit(user)"
                    class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(user.id)"
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </template>

              <!-- Edit Mode -->
              <template v-else>
                <td colspan="5">
                  <form @submit.prevent="handleUpdate" class="space-y-2 py-2">
                    <div class="flex gap-2">
                      <input
                        v-model="updateForm.name"
                        type="text"
                        placeholder="Name"
                        class="flex-1 p-1 border rounded"
                      />
                      <input
                        v-model="updateForm.email"
                        type="email"
                        placeholder="Email"
                        class="flex-1 p-1 border rounded"
                      />
                      <select
                        v-model="updateForm.role"
                        class="p-1 border rounded"
                      >
                        <option :value="UserRole.USER">User</option>
                        <option :value="UserRole.ADMIN">Admin</option>
                        <option :value="UserRole.GUEST">Guest</option>
                      </select>
                      <div class="flex items-center gap-1">
                        <input
                          v-model="updateForm.isActive"
                          type="checkbox"
                          id="updateIsActive"
                        />
                        <label for="updateIsActive">Active</label>
                      </div>
                      <button
                        type="submit"
                        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        :disabled="updateForm.hasErrors()"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        @click="editingUser = null"
                        class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                    <!-- Validation Errors -->
                    <div v-if="updateForm.hasErrors()" class="text-red-500 text-sm">
                      <div v-if="updateForm.getError('name')">{{ updateForm.getError('name') }}</div>
                      <div v-if="updateForm.getError('email')">{{ updateForm.getError('email') }}</div>
                      <div v-if="updateForm.getError('role')">{{ updateForm.getError('role') }}</div>
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
</template>