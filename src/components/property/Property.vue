<template>
  <div class="position-relative">
    <div class="px-2" role="button" @click="toggleVisibility" ref="triggerRef">
      <FIcon :icon="EIcon.Property" />
    </div>
    <Teleport to="body">
      <div v-if="isVisible">
        <div
          class="position-fixed card menu"
          :style="menuStyle"
          @mouseleave="toggleVisibility"
        >
          <div v-for="element in data" :key="element.id">
            <div
              class="btn d-flex"
              :class="isHover[element.id] ? 'bg-secondary' : 'bg-light'"
              @click="emit('click', element)"
              @mouseover="isHover[element.id] = true"
              @mouseleave="isHover[element.id] = false"
            >
              <FIcon :icon="element.icon" />
              <div class="ms-4">{{ element.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { EIcon } from '@/features/shared/enum/EIcon'
import { Property } from '@/features/shared/domain/property'

interface Props {
  data?: Property[]
  inverse?: boolean
  onClick?: Function
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  inverse: false,
})
const emit = defineEmits<{
  click: [data: Property]
}>()

const isVisible = ref(false)
const isHover = ref({} as Record<string, boolean>)
const triggerRef = ref<HTMLElement | null>(null)
const menuPosition = ref({ top: 0, left: 0 })

const menuStyle = computed(() => ({
  top: `${menuPosition.value.top}px`,
  left: `${menuPosition.value.left}px`,
}))

function updatePosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const spaceRight = window.innerWidth - rect.left
  menuPosition.value = {
    top: rect.bottom,
    left: spaceRight < rect.width ? rect.right - rect.width : rect.left,
  }
}

function toggleVisibility() {
  isVisible.value = !isVisible.value
  if (isVisible.value) {
    updatePosition()
  }
}

// Update position on scroll or resize
function handleScroll() {
  if (isVisible.value) {
    updatePosition()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
.menu {
  z-index: 9999;
}
</style>
