<template>
  <div class="custom-select position-relative">
    <div :class="[fill ? 'flex-fill' : '']">
      <div
        class="drop"
        @click="toggleDropdown"
        :class="[disabled ? 'disabled' : '', error ? 'drop_invalid' : '']"
      >
        <div class="selected-area">
          <template v-if="multiple">
            <TagsContainer
              :values="selectedValues"
              :value-field="valueField"
              :label-field="labelField"
              :max-visible="maxVisibleChips"
              :color="chipColor"
              @remove="removeSelection"
            />
          </template>
          <template v-else>
            <span class="selected-text">{{ selectedLabel }}</span>
          </template>

          <input
            type="text"
            class="search-input"
            v-model="searchQuery"
            @click.stop
            @input="handleInput"
            @focus="handleFocus"
            @keydown="handleKeydown"
            :placeholder="selectedValues.length ? '' : defaultPlaceholder"
            :disabled="disabled"
          />
        </div>
        <div class="select-arrow"></div>
      </div>

      <div class="select-items" v-show="(isOpen || searchQuery) && !disabled">
        <div
          v-for="option in filteredOptions"
          :key="getValue(option)"
          @click="selectOption(option)"
          :class="{ selected: isSelected(getValue(option)) }"
          class="option-item"
        >
          {{ getLabel(option) }}
        </div>
        <div v-if="filteredOptions.length === 0" class="no-results">
          No results found
        </div>
      </div>
    </div>
    <div v-if="error" class="error-text">
      {{ error }}
    </div>
    <div v-else class="mt-1"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { EColor } from '@/features/shared/enum/EColor'
import TagsContainer from '../tag/TagsContainer.vue'

const { t } = useI18n()

interface Props<T> {
  fill?: boolean
  options: T[]
  valueField?: keyof T
  labelField?: keyof T
  placeholder?: string
  disabled?: boolean
  error?: string
  multiple?: boolean
  chipColor?: EColor
}

const props = withDefaults(defineProps<Props<any>>(), {
  valueField: 'value',
  labelField: 'label',
  placeholder: '',
  disabled: false,
  multiple: false,
  fill: true,
})

const model = defineModel<any[] | any>()
const isOpen = ref(false)
const searchQuery = ref('')
const maxVisibleChips = ref(3)

const defaultPlaceholder = computed(
  () => props.placeholder ?? t('common.placeholder.dropdown')
)
const emit = defineEmits<{
  change: []
}>()
const selectedLabel = computed(() => {
  if (!model.value) return ''
  const selected = props.options.find((opt) => getValue(opt) === model.value)
  return selected ? getLabel(selected) : ''
})

function handleKeydown(event: KeyboardEvent) {
  // Handle backspace for both multiple and single selection
  if (event.key === 'Backspace' && searchQuery.value === '') {
    event.preventDefault()
    if (props.multiple) {
      if (Array.isArray(model.value) && model.value.length > 0) {
        const lastValue = model.value[model.value.length - 1]
        removeSelection(lastValue)
      }
    } else {
      if (model.value !== null) {
        removeSelection(model.value)
      }
    }
  }

  // Handle enter key for selection
  if (
    event.key === 'Enter' &&
    filteredOptions.value.length > 0 &&
    isOpen.value
  ) {
    event.preventDefault()
    const firstOption = filteredOptions.value[0]
    selectOption(firstOption)
  }
}

function handleInput() {
  if (!isOpen.value && !props.disabled) {
    isOpen.value = true
  }
}

function handleFocus() {
  if (!isOpen.value && !props.disabled) {
    isOpen.value = true
  }
}

const selectedValues = computed(() => {
  if (props.multiple) {
    return Array.isArray(model.value)
      ? model.value
          .map((v) => props.options.find((opt) => getValue(opt) === v))
          .filter(Boolean)
      : []
  }
  const selected = props.options.find((opt) => getValue(opt) === model.value)
  return selected ? [selected] : []
})

const filteredOptions = computed(() => {
  return props.options.filter((option) =>
    getLabel(option)?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function getValue(option: any): string | number {
  return option[props.valueField]
}

function getLabel(option: any): string {
  return option[props.labelField]
}

function isSelected(value: any): boolean {
  if (props.multiple) {
    return Array.isArray(model.value) && model.value.includes(value)
  }
  return model.value === value
}

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function selectOption(option: any) {
  if (props.disabled) return

  const value = getValue(option)
  if (props.multiple) {
    const newValue = Array.isArray(model.value) ? [...model.value] : []
    const index = newValue.indexOf(value)
    if (index === -1) {
      newValue.push(value)
    } else {
      newValue.splice(index, 1)
    }
    model.value = newValue
  } else {
    model.value = value
    isOpen.value = false
  }
  searchQuery.value = ''
  emit('change')
}

function removeSelection(value: any) {
  if (props.disabled) return

  if (props.multiple) {
    model.value = (model.value as any[]).filter((v) => v !== value)
  } else {
    model.value = null
  }
  emit('change')
}

function closeDropdown(e: Event) {
  if (!e.target || !(e.target as HTMLElement).closest('.custom-select')) {
    isOpen.value = false
    if (!props.multiple) {
      searchQuery.value = ''
    }
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.selected-area {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
  flex: 1;
  min-height: 24px;
}

.no-results {
  padding: 0.5rem 1rem;
  color: var(--txt-placeholder);
  text-align: center;
}

.selected-text {
  color: var(--color-text);
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  min-width: 50px;
  color: var(--color-text);
}

.search-input::placeholder {
  color: var(--txt-placeholder);
}

.search-input:disabled {
  cursor: not-allowed;
  background-color: transparent;
}

.select-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--txt-dark);
  margin-left: 0.5rem;
}

.select-items {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: var(--layout-overlay);
  border: var(--border-width) solid var(--border-color);
  border-radius: 0.25rem;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
}

/* Dropdown styles */
.drop {
  padding: 0.25rem 1rem;
  border: var(--border-width) solid var(--border-color);
  border-radius: 0.25rem;
  background-color: var(--layout-overlay);
  color: var(--text-color);
  transition: all 0.2s ease;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drop.disabled {
  background-color: var(--background-color-disabled);
  cursor: not-allowed;
}

.drop:hover:not(.disabled) {
  border: var(--border-width) solid var(--color-brand-primary-default);
  background-color: var(--layout-overlay-hovered);
}
.drop_invalid {
  border: var(--border-width) solid var(--color-brand-danger-dark);
  color: var(--color-brand-danger-dark);
}

.bt:active {
  border: var(--border-color) solid var(--color-brand-primary-default);
}

.option-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: var(--text-color);
}

.option-item:hover,
.option-item.selected {
  background-color: var(--color-brand-primary-subtle);
}
</style>
