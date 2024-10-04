<template>
  <div class="d-flex justify-content-end">
    <ul class="nav nav-pills">
      <li class="mx-1" v-for="tab in tabs">
        <a
          class="rounded p-2 ml-1"
          :class="
            tab.selected ? 'bg-' + colorSelected : 'bg-' + colorNoSelected
          "
          @click="change(tab.id)"
        >
          <slot :data="tab"></slot>
        </a>
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
  colorSelected: {
    type: String,
    default: EColor.Primary,
  },
  colorNoSelected: {
    type: String,
    default: EColor.Light,
  },
  change: {
    type: Function,
    require: true,
    default: function (id: number) {},
  },
  selectData: {
    type: Array<any>,
    default: [],
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
