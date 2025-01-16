:position="hoveredMenuPosition"
<template>
  <div
    class="text-white position-relative transition-all duration-300"
    :class="[
      `bg-${EColor.Dark}`,
      { 'w-64': menuStore.isOpen, 'w-16': !menuStore.isOpen },
    ]"
  >
    <Logo
      class="mb-4 m-3"
      style="height: 1rem; width: 1rem"
      role="button"
      @click="goToHome"
    />
    <div
      class="position-absolute start-100 translate-middle"
      @click="menuStore.toggleMenu"
    >
      <FIcon
        class="bg-success rounded-circle p-1"
        :icon="menuStore.isOpen ? EIcon.MenuLeft : EIcon.MenuRight"
        style="height: 1rem; width: 1rem"
      />
    </div>
    <div class="mb-3"></div>
    <div class="d-flex flex-column">
      <div v-for="(element, index) in menuStore.items" :key="element.path">
        <div
          class="menu-item position-relative px-2"
          @mouseenter="handleMenuHover(element, index, $event)"
          @mouseleave="handleMenuLeave"
        >
          <div
            class="d-flex align-items-center p-2 text-white cursor-pointer"
            :class="{ 'justify-content-center': !menuStore.isOpen }"
            @click="handleMenuClick(element)"
            :title="element.path"
          >
            <FIcon :icon="element.icon" class="me-2" />
            <span v-if="menuStore.isOpen">{{ t(element.label) }}</span>
            <FIcon
              v-if="menuStore.isOpen && element.subMenu"
              :icon="
                expandedMenus.includes(element.path)
                  ? EIcon.MenuLeft
                  : EIcon.MenuRight
              "
              class="ms-auto"
            />
          </div>

          <!-- Submenu for expanded state -->
          <div
            v-if="
              element.subMenu &&
              menuStore.isOpen &&
              expandedMenus.includes(element.path)
            "
            class="ms-3"
          >
            <div
              v-for="subItem in element.subMenu"
              :key="subItem.path"
              class="menu-item position-relative"
            >
              <RouterLink
                :to="subItem.path"
                class="d-flex align-items-center p-2 text-white text-decoration-none"
                :title="subItem.path"
              >
                <FIcon :icon="subItem.icon" class="me-2" />
                <span>{{ t(subItem.label) }}</span>
              </RouterLink>
            </div>
          </div>
          <PopupSubmenu
            :sub-menu="element.subMenu"
            :show="!menuStore.isOpen && hoveredMenu === element.path"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '@/components/icons/Logo.vue'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EColor } from '@/features/shared/enum/EColor'
import type { IMenu } from '@/features/menu/domain/menu'
import { useMenuStore } from '@/features/menu/store/menuStore'
import PopupSubmenu from './PopupSubmenu.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const expandedMenus = ref<string[]>([])
const hoveredMenu = ref<string>('')
function goToHome() {
  router.push('/')
}

function handleMenuClick(menu: IMenu) {
  console.log('hey', menu);
  if (menu.subMenu) {
    if (menuStore.isOpen) {
      const index = expandedMenus.value.indexOf(menu.path)
      if (index === -1) {
        expandedMenus.value.push(menu.path)
      } else {
        expandedMenus.value.splice(index, 1)
      }
    }
  } else {
    console.log('goto', menu.path);
    
    router.push(menu.path)
  }
}

function handleMenuHover(menu: IMenu, index: number, event: MouseEvent) {
  if (menu.subMenu && !menuStore.isOpen) {
    hoveredMenu.value = menu.path
    const element = event.currentTarget as HTMLElement
    const rect = element.getBoundingClientRect()
  }
}

function handleMenuLeave() {
  hoveredMenu.value = ''
}
onMounted(()=>{
   menuStore.initializeMenu()
})
// watchers
// watch(
//   () => route.params,
//   (newParams) => {
//     const tenant = newParams.tenantId as string
//     if (tenant != undefined) {
     
//     }
//   }
// )
</script>

<style scoped>
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
