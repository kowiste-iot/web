<template>
  <div
    v-if="subMenu && show"
    ref="popupContainer"
    class="pop-submenu-container"
    :class="{ 'pop-submenu-bottom': useBottomPosition }"
  >
    <div class="hover-bridge"></div>
    <div ref="popupContent" class="pop-submenu">
      <div
        v-for="subItem in subMenu"
        :key="subItem.path"
        class="menu-item pop-submenu-item"
      >
        <RouterLink
          :to="subItem.path"
          class="submenu-item-element"
          :title="subItem.path"
          @click="close()"
        >
          <Flex :gap="3">
            <FIcon :icon="subItem.icon" />
            <span>{{ t(subItem.label) }}</span>
          </Flex>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IMenu } from '@/features/menu/domain/menu'
import Flex from '@/components/layout/Flex.vue'
const emit = defineEmits<{
  menuClick: []
}>()
const { t } = useI18n()

const props = defineProps({
  subMenu: {
    type: Array as () => IMenu[] | undefined,
    default: () => [],
  },
  show: {
    type: Boolean,
    default: false,
  },
  useBottomPosition: {
    type: Boolean,
    default: false,
  },
})

const popupContainer = ref<HTMLElement | null>(null)
const popupContent = ref<HTMLElement | null>(null)
function close() {
  emit('menuClick')
}
</script>

<style scoped>
.pop-submenu-container {
  position: absolute;
  left: 100%;
  top: 0;
  display: flex;
  animation: fadeIn 0.2s ease-out;
  z-index: 1001;
}

/* Position submenu from bottom for items near the bottom of the screen */
.pop-submenu-bottom {
  top: auto;
  bottom: 0;
}

.hover-bridge {
  width: var(--size-050);
  margin-left: -var(--size-050);
}

.pop-submenu {
  background-color: var(--layout-menu);
  z-index: 1000;
  border-radius: var(--border-sm);
  min-width: 200px;
  max-height: 80vh;
  overflow-y: auto;
  padding: var(--size-050) var(--size-050);
}

.pop-submenu-item {
  padding: var(--size-050) var(--size-050);
}
.submenu-item-element {
  text-decoration: none;
  color: var(--text-color-light);
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
@media (max-width: 768px) {
  .pop-submenu-container {
    position: static;
  }
  .pop-submenu {
    background-color: var(--layout-menu-subtle);
    width: 100%;
  }
}
</style>
