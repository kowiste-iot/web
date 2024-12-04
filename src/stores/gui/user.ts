import { defineStore } from 'pinia';
import type { IUser } from '@/model/gui/user';

interface State {
  _user: IUser | undefined;
}

// Mock user data matching IUser interface
const mockUser: IUser = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  name: 'John',
  surname: 'Doe',
  role: 'admin',
  phoneNumber:'44444444'

};

// Updated store with mock data method
export const useUser = defineStore('userStore', {
  state: (): State => ({
    _user: undefined,
  }),
  getters: {
    user(): IUser | undefined {
      return this._user;
    },
  },
  actions: {
    setUser(user: IUser) {
      this._user = user;
    },
    loadMockUser() {
      this.setUser(mockUser);
    }
  }
});

