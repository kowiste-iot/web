<template>
  <Flex
    column
    class="sidemenu"
    :style="`min-width: ${
      menuStore.isOpen ? 'var(--size-menu-open)' : 'var(--size-menu-close)'
    } `"
  >
    <div class="logo-container">
      <Logo
        class="logo"
        logoColor="var(--color-brand-danger-default)"
        :textColor="'var(--color-text-inverse)'"
        role="button"
        @click="goToHome"
      />
      <FIcon
        class="close-mobile"
        :icon="EIcon.Cancel"
        @click="close"
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
      <MenuItems
        :items="menuStore.items"
        :is-open="menuStore.isOpen"
        @menuClick="close"
      />
      <div class="admin-menu-container">
        <MenuItems
          :items="menuStore.admin"
          :is-open="menuStore.isOpen"
          :bottom="true"
          @menuClick="close"
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
const emit = defineEmits<{
  close: []
}>()
const { theme } = useTheme()
const router = useRouter()
const menuStore = useMenuStore()

function goToHome() {
  close()
  router.push('/')
}
function close() {
  emit('close')
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
.close-mobile {
  visibility: hidden;
}
@media (max-width: 768px) {
  .close-mobile {
    visibility: visible;
    position: absolute;
    right: 0;
    background-color: var(--layout-overlay);
    background-color: var(--layout-overlay);
    padding: var(--size-050);
    margin: var(--size-200);
    border-radius: var(--border-sm);
    height: var(--size-300);
    width: var(--size-300);
    cursor: pointer;
  }
  .logo-container {
    display: flex;
  }
  .toggle-button {
    visibility: hidden;
  }
}
</style>
