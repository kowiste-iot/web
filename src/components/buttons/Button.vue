<template>
  <Flex
    class="bt"
    :class="[`bt-${color}`, compact ? 'bt-sm' : '']"
    role="button"
  >
    <Flex
      :class="{ invisible: loading }"
      :justify="EFlexJustify.Center"
      :gap="1"
    >
      <FIcon v-if="icon" class="center-icon far" :icon="icon" />
      <slot />
    </Flex>
    <div v-if="loading" class="loading-wrapper">
      <Spinner compact :color="'var(--btn-text-color)'" />
    </div>
  </Flex>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import Spinner from '@/components/loading/Spinner.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import Flex from '../layout/Flex.vue'
import { EFlexJustify } from '../layout/EFlex'

// other imports
// props
interface Props {
  icon?: EIcon
  color?: EColor
  loading?: boolean
  outline?: boolean
  compact?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  color: EColor.Primary,
  outline: false,
  compact: false,
})
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped>
.center-icon {
  margin-top: var(--size-050);
}

.loading-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.invisible {
  visibility: hidden;
}

/* Button styles*/

.bt {
  --btn-padding-y: 0.5rem;
  --btn-padding-x: 0.5rem;
  --btn-font-size: 1rem;

  padding: var(--btn-padding-y) var(--btn-padding-x);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  box-sizing: border-box;
  font-size: var(--btn-font-size);
  color: var(--btn-text-color);
}

.bt:hover {
  background-color: var(--btn-hover);
}

.bt:active {
  background-color: var(--btn-press);
}

.bt:disabled,
.bt[disabled] {
  background-color: var(--button-color-disabled);
  cursor: not-allowed;
  color: var(--button-color-text-disabled);
}

.bt:focus {
  outline: none;
}

/* Small Button Variant */
.bt-sm {
  --btn-padding-y: var(--size-025);
  --btn-padding-x: var(--size-075);
  --btn-font-size: 0.875rem;
}

/* colors button */
.bt-primary {
  --btn-base: var(--color-brand-primary-default);
  --btn-hover: var(--color-brand-primary-dark);
  --btn-press: var(--color-brand-primary-darkest);
  background-color: var(--btn-base);
  --btn-text-color: var(--text-color-button-light);
}

.bt-secondary {
  --btn-base: var(--color-brand-secondary-default);
  --btn-hover: var(--color-brand-secondary-dark);
  --btn-press: var(--color-brand-secondary-darkest);
  background-color: var(--btn-base);
  --btn-text-color: var(--text-color-button-dark);
}
.bt-success {
  --btn-base: var(--color-brand-success-default);
  --btn-hover: var(--color-brand-success-dark);
  --btn-press: var(--color-brand-success-darkest);
  background-color: var(--btn-base);
  --btn-text-color: var(--text-color-button-light);
}

.bt-tertiary {
  --btn-base: var(--color-brand-tertiary-default);
  --btn-hover: var(--color-brand-tertiary-dark);
  --btn-press: var(--color-brand-tertiary-darkest);
  background-color: var(--btn-base);
  --btn-text-color: var(--text-color-button-dark);
}
[data-theme='dark'] .bt-tertiary {
  --btn-text-color: var(--text-color-button-light);
}

.bt-warning {
  --btn-base: var(--color-brand-warning-default);
  --btn-hover: var(--color-brand-warning-dark);
  --btn-press: var(--color-brand-warning-darkest);
  background-color: var(--btn-base);
  --btn-text-color: var(--text-color-button-dark);
}

.bt-danger {
  --btn-base: var(--color-brand-danger-dark);
  --btn-hover: var(--color-brand-danger-darkest);
  --btn-press: var(--color-brand-danger-darkest);
  background-color: var(--btn-base);
  --btn-text-color: var(--text-color-button-light);
}
</style>
