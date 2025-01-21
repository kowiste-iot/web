<template>
  <div class="position-relative">
    <div 
      class="border rounded p-2" 
      :class="error ? 'border-danger' : ''" 
      role="button" 
      @click="toggleDropdown"
    >
      <div v-if="model.length > 0" class="d-flex flex-wrap gap-1">
        <span 
          v-for="item in model" 
          :key="item"
          class="badge"
          :class="`bg-${chipColor}`"
        >
          {{ item }}
          <span 
            class="ms-1 cursor-pointer" 
            @click.stop="removeItem(item)"
          >
            ×
          </span>
        </span>
      </div>
      <div v-else>
        {{ placeholder }}
      </div>
    </div>

    <div v-if="error" class="text-danger mt-1 small">
      {{ error }}
    </div>

    <ul
      v-if="isOpen"
      class="position-absolute top-100 mt-1 list-group w-100 shadow"
      style="max-height: 200px; overflow-y: auto; z-index: 1000;"
    >
      <li v-if="searchable" class="list-group-item p-1">
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="searchText"
          placeholder="Search..."
          @click.stop
        >
      </li>

      <li
        v-for="option in filteredOptions"
        :key="option"
        class="list-group-item list-group-item-action"
        :class="{
          [`bg-${chipColor} text-white`]: isSelected(option),
          'hover-color': !isSelected(option)
        }"
        @click.stop="toggleSelection(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  options: (string | number)[]
  placeholder?: string
  searchable?: boolean
  error?: string
  chipColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select items',
  searchable: false,
  chipColor: 'primary'
})

const model = defineModel<(string | number)[]>({
  default: () => []
})

const isOpen = ref(false)
const searchText = ref('')

const filteredOptions = computed(() => {
  if (!searchText.value) return props.options
  
  return props.options.filter(option => 
    String(option)
      .toLowerCase()
      .includes(searchText.value.toLowerCase())
  )
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchText.value = ''
  }
}

function isSelected(option: string | number): boolean {
  return model.value.includes(option)
}

function toggleSelection(option: string | number) {
  const newValue = [...model.value]
  const index = newValue.indexOf(option)
  
  if (index === -1) {
    newValue.push(option)
  } else {
    newValue.splice(index, 1)
  }
  
  model.value = newValue
}

function removeItem(item: string | number) {
  model.value = model.value.filter(i => i !== item)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover-color:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
}

:deep(.list-group-item.active) {
  border-color: var(--bs-primary);
}
</style>