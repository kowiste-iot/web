<template>
  <Flex
    column
    class="sidemenu"
    :style="`min-width: ${
      menuStore.isOpen ? 'var(--size-menu-open)' : 'var(--size-menu-close)'
    } `"
  >
    <div class="logo-container">
      <FIcon
        class="burger-button"
        :icon="EIcon.Burger"
        role="button"
        style="height: 1rem; width: 1rem"
      />
      <Logo
        class="logo"
        logoColor="var(--color-brand-danger-default)"
        :textColor="'var(--color-text-inverse)'"
        role="button"
        @click="goToHome"
      />
      <div class="toggle-button" @click="menuStore.toggleMenu">
        <FIcon
          class="bg-success rounded-circle p-1"
          :icon="menuStore.isOpen ? EIcon.MenuLeft : EIcon.MenuRight"
          style="height: 1rem; width: 1rem"
        />
      </div>
    </div>
    <Flex column :justify="EFlexJustify.Between" fullHeight>
      <MenuItems :items="menuStore.items" :is-open="menuStore.isOpen" />
      <div class="admin-menu-container">
        <MenuItems
          :items="menuStore.admin"
          :is-open="menuStore.isOpen"
          :bottom="true"
        />
      </div>
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/components/icons/Logo.vue'
import { EIcon } from '@/features/shared/enum/EIcon'
import { useMenuStore } from '@/features/menu/store/menuStore'
import MenuItems from './MenuItems.vue'
import { useTheme } from '@/composable/useTheme'
import { EFlexJustify } from '@/components/layout/EFlex'
import Flex from '@/components/layout/Flex.vue'

const { theme } = useTheme()
const router = useRouter()
const menuStore = useMenuStore()

function goToHome() {
  router.push('/')
}

onMounted(() => {
  menuStore.initializeMenu()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.sidemenu {
  position: relative;
  height: 100%; /* Use 100% of parent height instead of viewport height */
  transition: all 0.3s;
  border-right: var(--border-width) solid;
  border-color: var(--border-color);
  background-color: var(--layout-menu);
}
.logo-container {
  padding-right: 1rem;
  position: relative; /* Ensure this is a positioning context */
}

.toggle-button {
  position: absolute;
  right: calc(-1 * var(--size-150)); /* Position it outside the container */
  top: 100%; /* Center it vertically */
  transform: translateY(-100%); /* Proper vertical centering */
  z-index: var(--index-card);
  cursor: pointer;
}
.burger-button {
  visibility: hidden;
}
.admin-menu-container {
  position: relative;
  margin-bottom: 1rem;
}
.logo {
  width: var(--size-300);
  height: var(--size-300);
  margin-inline: var(--size-150);
  margin-top: var(--size-300);
  margin-bottom: var(--size-800);
}
@media (max-width: 768px) {
  .sidemenu {
    position: relative;
  }
  .logo-container {
    display: flex;
  }
  .toggle-button {
    visibility: hidden;
  }
  .burger-button {
    visibility: visible;
    margin-top: var(--size-300);
    padding: var(--size-050);
    border-radius: var(--border-sm);
    background-color: var(--layout-overlay);
    z-index: var(--index-overlay);
  }
}
</style>
