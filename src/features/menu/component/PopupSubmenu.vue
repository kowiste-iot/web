<!-- PopupSubmenu.vue -->
<template>
  <div
    v-if="subMenu && show"
    class="popup-submenu position-absolute start-100 top-0 ms-1"
    :class="`bg-${EColor.Dark}`"
    style="
      z-index: 1000;
      border-radius: 4px;
      padding: 0.5rem;
      min-width: 200px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    "
  >
    <div
      v-for="subItem in subMenu"
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IMenu } from '@/features/menu/domain/menu'
import { EColor } from '@/features/shared/enum/EColor';

const { t } = useI18n()

defineProps<{
  subMenu?: IMenu[]
  show: boolean
}>()
</script>

<style scoped>
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.popup-submenu {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
