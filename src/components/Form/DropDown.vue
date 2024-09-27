``
<template>
  <div class="position-relative">
    <div
      class="bg-light border rounded p-1 d-flex"
      role="button"
      @click="toggleVisibility"
    >
      <i v-if="icon" class="pe-2 pt-1" :class="icon"></i>
      <div v-if="model">
        {{ model[optionValue] }}
      </div>
      <div v-else>
        <div v-if="placeholder">{{ placeholder }}</div>
        <div v-else>Select an option</div>
      </div>
    </div>
    <ul
      v-if="isVisible"
      class="position-absolute top-1 list-group w-100"
      @mouseleave="toggleVisibility"
    >
      <li v-if="filter" class="bg-ligth list-group-item w-100 p-1">
        <Input
          :icon="EIcon.MagnifyGlass"
          class="w-100"
          placeholder="filter"
          :onChange="changeFilter"
          v-model="filterText"
        />
      </li>
      <li
        v-for="element in optionsFilter"
        :class="isHover[element.id] ? 'bg-secondary' : 'btn-ligth'"
        @mouseover="isHover[element.id] = true"
        @mouseleave="isHover[element.id] = false"
        class="list-group-item"
        role="button"
        @click="() => change(element)"
      >
        <div class="d-flex">
          <i
            v-if="model == element"
            class="pt-1 me-2"
            :class="EIcon.Success"
          ></i>
          <i v-else class="me-4"></i>
          <slot name="option" :data="element" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
// components import
import Input from '@/components/form/Input.vue'

// model imports
import { EIcon } from '@/enums/EIcon'

// other imports
// props
const props = defineProps({
  options: {
    type: Array<any>,
    default: [],
  },
  optionValue: {
    type: String,
    default: 'id',
  },
  optionLabel: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
  },
  icon: {
    type: String,
  },
  filter: {
    type: Boolean,
  },
  onChange: {
    type: Function,
    default: function () {},
  },
})
// data
const model = defineModel({} as { [key: string]: any })
const isVisible = ref(false)
const isHover = ref({} as { [key: number]: boolean })
const optionsFilter = ref(new Array<any>())
let filterText = ''
// storage calls
// computed
// methods
function toggleVisibility() {
  isVisible.value = !isVisible.value
  if (props.filter) changeFilter()
}
function change(data: any) {
  model.value = data
  toggleVisibility()
  props.onChange(data)
}
function changeFilter() {
  if (!props.optionLabel) return
  optionsFilter.value = props.options.filter((option) => {
    return option[props.optionLabel].includes(filterText)
  })
}
// lifeCycle
// watch
</script>

<style scoped></style>
