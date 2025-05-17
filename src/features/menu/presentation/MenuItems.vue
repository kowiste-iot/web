<template>
  <Flex column :gap="2">
    <div
      v-for="(item, index) in items"
      :key="item.path"
      class="position-relative"
      @mouseenter="handleMenuHover(item, $event)"
      @mouseleave="handleMenuLeave"
    >
      <div v-if="item.isHeader" class="menu-header">
        <div class="menu-header-item">
          {{ t(item.label) }}
        </div>
        <!-- Display only first-level submenu items when parent is a header -->
        <div v-if="item.subMenu" class="menu-submenu">
          <div
            v-for="subItem in item.subMenu"
            :key="subItem.path"
            class="position-relative"
            @mouseenter="handleSubItemHover(subItem, $event)"
            @mouseleave="handleMenuLeave"
          >
            <Flex
              class="menu-item align-items-center py-2 px-3"
              :justify="!isOpen ? EFlexJustify.Center : undefined"
              @click="handleMenuClick(subItem)"
            >
              <FIcon :icon="subItem.icon" class="me-2" />
              <template v-if="isOpen">
                <span>{{ t(subItem.label) }}</span>
              </template>
              <FIcon
                v-if="subItem.subMenu && subItem.subMenu.length > 0"
                :icon="
                  hoveredMenu === item.path ? EIcon.MenuClose : EIcon.MenuOpen
                "
                class="fold-mobile"
              />
            </Flex>

            <!-- Popup submenu for second level items -->
            <PopupSubmenu
              v-if="subItem.subMenu"
              :sub-menu="subItem.subMenu"
              :show="hoveredMenu === subItem.path"
              @menu-click="emit('menuClick')"
            />
          </div>
        </div>
      </div>
      <Flex
        v-else
        class="menu-item align-items-center py-1 px-3"
        :justify="!isOpen ? EFlexJustify.Center : undefined"
        @click="handleMenuClick(item)"
      >
        <FIcon :icon="item.icon" class="me-2" />
        <template v-if="isOpen">
          <span>{{ t(item.label) }}</span>
        </template>
        <Flex
          v-if="item.subMenu && item.subMenu.length > 0"
          class="fold-mobile"
          :justify="EFlexJustify.End"
        >
          <FIcon
            :icon="hoveredMenu === item.path ? EIcon.MenuClose : EIcon.MenuOpen"
          />
        </Flex>
      </Flex>

      <!-- Popup submenu for all non-header items -->
      <PopupSubmenu
        v-if="item.subMenu && !item.isHeader"
        :sub-menu="item.subMenu"
        :show="hoveredMenu === item.path"
        :use-bottom-position="!!props.bottom"
        @menu-click="emit('menuClick')"
      />
    </div>
  </Flex>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { IMenu } from '@/features/menu/domain/menu'
import PopupSubmenu from './PopupSubmenu.vue'
import Flex from '@/components/layout/Flex.vue'
import { EFlexJustify } from '@/components/layout/EFlex'
import { EIcon } from '@/features/shared/enum/EIcon'

const props = defineProps<{
  items: IMenu[]
  isOpen: boolean
  bottom?: boolean
}>()
const emit = defineEmits<{
  menuClick: []
}>()
const { t } = useI18n()
const router = useRouter()
const hoveredMenu = ref('')

function handleMenuClick(item: IMenu) {
  if (!item.subMenu) {
    emit('menuClick')
    router.push(item.path)
  }
}

function handleMenuHover(item: IMenu, event: MouseEvent) {
  if (item.subMenu) {
    hoveredMenu.value = item.path
  }
}

function handleSubItemHover(item: IMenu, event: MouseEvent) {
  if (item.subMenu) {
    hoveredMenu.value = item.path
  }
}

function handleMenuLeave() {
  hoveredMenu.value = ''
}
</script>

<style scoped>
.fold-mobile {
  visibility: hidden;
}
@media (max-width: 768px) {
  .fold-mobile {
    visibility: visible;
    flex: 1;
  }
}
</style>
