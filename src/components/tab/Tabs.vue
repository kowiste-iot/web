<template>
  <div class="d-flex justify-content-end">
    <ul class="nav">
      <li class="mx-1" v-for="tab in tabs">
        <div
          class="p-2 ml-1"
          :class="tab.selected ? `border-bottom border-${color} border-2` : ''"
          role="button"
          @click="change(tab.id)"
        >
          <slot :data="tab"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// imports
import type { Tab } from '@/model/gui/tab'
import { EColor } from '@/enums/gui/EColor'

// props
const model = defineModel({ default: '' })
const props = defineProps({
  tabs: {
    type: Array<Tab>,
    require: true,
    default: [],
  },
  color: {
    type: String,
    default: EColor.Primary,
  },
  change: {
    type: Function,
    require: true,
    default: function (id: number) {},
  },
})
// data
// storage calls
// computed
// methods
//return the class for the tab

// lifeCycle
// watch
</script>

<style scoped></style>
