``
<template>
  <div class="position-relative">
    <div
      class="border rounded p-1 d-flex"
      role="button"
      @click="toggleVisibility"
    >
      <FIcon v-if="icon" class="pe-2 pt-1" :icon="icon" />
      <div v-if="model">
        {{ (model as any)[optionValue] }}
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
      <div v-for="(group, key) in optionsFiltered">
        <div
          v-if="key != ''"
          class="bg-ligth list-group-item w-100 p-1 text-center"
        >
          <slot name="group" :data="key">
            {{ key }}
          </slot>
        </div>
        <li
          v-for="element in group"
          :class="isHover[element.id] ? 'bg-secondary' : 'btn-ligth'"
          @mouseover="isHover[element.id] = true"
          @mouseleave="isHover[element.id] = false"
          class="list-group-item"
          role="button"
          @click="change(element)"
        >
          <div class="d-flex">
            <FIcon
              v-if="model == element"
              class="me-2 pt-1"
              :icon="EIcon.Success"
            />

            <div v-else class="me-4"></div>
            <slot name="option" :data="element" />
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref,onMounted } from 'vue'

// stores import
// components import
import Input from '@/components/form/Input.vue'

// model imports
import { EIcon } from '@/enums/gui/EIcon'

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
  groupLabel: {
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
const optionsFiltered = ref({} as { [group: string]: Array<any> })
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
  const filtered = props.options.filter((option) => {
    return option[props.optionLabel]
      .toLowerCase()
      .includes(filterText.toLowerCase())
  })
  optionsFiltered.value = {}
  if (props.groupLabel && props.groupLabel != '') {
    const groupValues = [
      ...new Set(filtered.map((obj) => obj[props.groupLabel])),
    ]
    groupValues.forEach((group) => {
      filtered.forEach((option) => {
        //loop over options filtered
        if (option[props.groupLabel] == group) {
          if (!optionsFiltered.value[group]) {
            optionsFiltered.value[group] = []
          }
          optionsFiltered.value[group].push(option)
        }
      })
    })
  } else {
    optionsFiltered.value[''] = filtered
  }

  // optionsFiltered.value
}
// lifeCycle
// watch
onMounted(() => {
  changeFilter()
})
</script>

<style scoped></style>
