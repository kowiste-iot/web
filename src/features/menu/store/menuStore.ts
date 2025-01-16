// features/menu/stores/menuStore.ts
import { defineStore } from 'pinia'
import { MenuService } from '../application/menuService'
import type { IMenu } from '../domain/menu'

export const useMenuStore = defineStore('menuStore', {
  state: () => ({
    isOpen: true,
    items: [] as IMenu[],
  }),

  actions: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },

    initializeMenu() {
      const menuService = new MenuService()
      this.items = menuService.getProcessedMenuItems()
    },
  },
})
