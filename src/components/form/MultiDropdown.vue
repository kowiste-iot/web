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
          :key="getItemId(item)"
          class="badge"
          :class="`bg-${chipColor}`"
        >
          {{ getItemLabel(item) }}
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
      class="position-absolute top-100 mt-1 list-group shadow"
      style="max-height: 200px; overflow-y: auto; z-index: 1000; min-width: 100%; width: max-content;"
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
        :key="getItemId(option)"
        class="list-group-item list-group-item-action"
        :class="{
          [`bg-${chipColor} text-white`]: isSelected(option),
          'hover-color': !isSelected(option)
        }"
        @click.stop="toggleSelection(option)"
      >
        {{ getItemLabel(option) }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  options: any[]
  idField?: string
  labelField?: string
  placeholder?: string
  searchable?: boolean
  error?: string
  chipColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select items',
  searchable: false,
  chipColor: 'primary',
  idField: 'id',
  labelField: 'label'
})

const model = defineModel<any[]>({
  default: () => []
})

const isOpen = ref(false)
const searchText = ref('')

function getItemId(item: any): string | number {
  return typeof item === 'object' ? item[props.idField] : item
}

function getItemLabel(item: any): string {
  return typeof item === 'object' ? item[props.labelField] : String(item)
}

const filteredOptions = computed(() => {
  if (!searchText.value) return props.options
  
  return props.options.filter(option => 
    getItemLabel(option)
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

function isSelected(option: any): boolean {
  return model.value.some(item => getItemId(item) === getItemId(option))
}

function toggleSelection(option: any) {
  const newValue = [...model.value]
  const index = newValue.findIndex(item => getItemId(item) === getItemId(option))
  
  if (index === -1) {
    newValue.push(option)
  } else {
    newValue.splice(index, 1)
  }
  
  model.value = newValue
}

function removeItem(item: any) {
  model.value = model.value.filter(i => getItemId(i) !== getItemId(item))
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