<template>
  <div class="position-relative" ref="dropdownRef">
    <div
      class="border rounded p-2 full-height"
      :class="[
        error ? 'border-danger' : '',
        disabled ? `bg-${EColor.Secondary} pe-none opacity-25 ` : '',
      ]"
      role="button"
      @click="toggleDropdown"
    >
      <template v-if="multiple">
        <div v-if="modelValue.length > 0" class="d-flex flex-wrap gap-1">
          <span
            v-for="item in modelValue"
            :key="getItemId(item)"
            class="badge"
            :class="[`bg-${chipColor} `, disabled ? `text-${EColor.Dark}` : '']"
          >
            {{ getItemLabel(item) }}
            <span
              v-if="!disabled"
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
      </template>
      <template v-else>
        <div>{{ modelValue ? getItemLabel(modelValue) : placeholder }}</div>
      </template>
    </div>

    <div v-if="error" class="text-danger mt-1 small">
      {{ error }}
    </div>

    <ul
      v-if="isOpen"
      class="position-absolute top-100 mt-1 list-group shadow"
      style="
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        min-width: 100%;
        width: max-content;
      "
    >
      <li v-if="searchable" class="list-group-item p-1">
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="searchText"
          placeholder="Search..."
          @click.stop
        />
      </li>

      <li
        v-for="option in filteredOptions"
        :key="getItemId(option)"
        class="list-group-item list-group-item-action"
        :class="{
          [`bg-${chipColor} text-white`]: isSelected(option),
          'hover-color': !isSelected(option),
        }"
        @click.stop="toggleSelection(option)"
      >
        {{ getItemLabel(option) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export interface Props {
  options: any[]
  idField?: string
  labelField?: string
  placeholder?: string
  searchable?: boolean
  error?: string
  disabled?: boolean
  chipColor?: string
  multiple?: boolean
}

export const defaultProps = {
  placeholder: 'Select items',
  searchable: false,
  chipColor: 'primary',
  idField: 'id',
  disabled: false,
  labelField: 'label',
  multiple: false,
}
</script>

<script setup lang="ts">
import { EColor } from '@/features/shared/enum/EColor'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<Props>(), defaultProps)
const modelValue = defineModel<any[] | any>()

const isOpen = ref(false)
const searchText = ref('')
const dropdownRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    searchText.value = ''
  }
}

function getItemId(item: any): string | number {
  return typeof item === 'object' ? item[props.idField] : item
}

function getItemLabel(item: any): string {
  return typeof item === 'object' ? item[props.labelField] : String(item)
}

const filteredOptions = computed(() => {
  if (!searchText.value) return props.options

  return props.options.filter((option) =>
    getItemLabel(option).toLowerCase().includes(searchText.value.toLowerCase())
  )
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchText.value = ''
  }
}

function isSelected(option: any): boolean {
  if (props.multiple) {
    return (modelValue.value as any[]).some(
      (item) => getItemId(item) === getItemId(option)
    )
  }
  return modelValue.value && getItemId(modelValue.value) === getItemId(option)
}

function toggleSelection(option: any) {
  if (props.multiple) {
    const newValue = [...(modelValue.value as any[])]
    const index = newValue.findIndex(
      (item) => getItemId(item) === getItemId(option)
    )

    if (index === -1) {
      newValue.push(option)
    } else {
      newValue.splice(index, 1)
    }

    modelValue.value = newValue
  } else {
    modelValue.value =
      modelValue.value && getItemId(modelValue.value) === getItemId(option)
        ? null
        : option
    isOpen.value = false
  }
}

function removeItem(item: any) {
  if (props.multiple) {
    modelValue.value = (modelValue.value as any[]).filter(
      (i) => getItemId(i) !== getItemId(item)
    )
  } else {
    modelValue.value = null
  }
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
