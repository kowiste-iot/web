<template>
  <div class="d-flex justify-content-end">
    <ul class="nav">
      <li class="mx-1" v-for="tab in tabs">
        <div
          class="p-2 ml-1"
          :class="tab.selected ? `border-bottom border-${color} border-2` : ''"
          role="button"
          @click="emit('change', tab.id)"
        >
          <slot :data="tab"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// imports
import type { Tab } from '@/features/shared/domain/tab'
import { EColor } from '@/features/shared/enum/EColor'

// props
const model = defineModel({ default: '' })
interface Props {
  tabs?: Tab[] // No '?' since it's required
  color?: EColor
}

const props = withDefaults(defineProps<Props>(), {
  color: EColor.Primary,
  tabs: () => [],
})
const emit = defineEmits<{
  change: [id: number]
}>()

// data
// storage calls
// computed
// methods
//return the class for the tab

// lifeCycle
// watch
</script>

<style scoped></style>
