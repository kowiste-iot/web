<template>
  <div class="flex-container" :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EFlexJustify } from './EFlex'
import type { EBreakpoint } from './grid/model'

// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  reverse?: boolean
  column?: boolean
  justify?: EFlexJustify
  breakpoint?: EBreakpoint
  fullHeight?: boolean
  fill?: boolean
  gap?: number
}
const props = withDefaults(defineProps<Props>(), {})
// data
//service
// computed
const classes = computed(() => {
  const classList = []
  
  // Default direction classes (for mobile/smallest screens)
  if (props.column) {
    classList.push(props.reverse ? 'flex-column-reverse' : 'flex-column')
  } else {
    classList.push(props.reverse ? 'flex-reverse' : 'flex-row')
  }
  
  // Add responsive classes if breakpoint is specified
  if (props.breakpoint) {
    // Create responsive class based on the breakpoint
    classList.push(`flex-responsive-${props.breakpoint}`)
  }
  
  // Other style classes
  if (props.gap) {
    classList.push(`gap-${props.gap}`)
  }
  
  if (props.justify) {
    classList.push(`justify-${props.justify}`)
  }
  
  if (props.fullHeight) {
    classList.push('flex-full-height')
  }
  
  if (props.fill) {
    classList.push('flex-fill')
  }
  
  return classList
})
// methods
// lifeCycle
// watch
</script>

<style scoped>
.flex-container {
  display: flex;
}

/* Direction variants */
.flex-row {
  flex-direction: row;
}

.flex-reverse {
  flex-direction: row-reverse;
}

.flex-column {
  flex-direction: column;
}

.flex-column-reverse {
  flex-direction: column-reverse;
}

/* Height variant */
.flex-full-height {
  flex-grow: 1;
  height: 100%;
}

/* Fill variant */
.flex-fill {
  flex: 1 1 auto;
}

/* Gap variants */
.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 1rem;
}

.gap-4 {
  gap: 1.5rem;
}

.gap-5 {
  gap: 2rem;
}

/* Base direction for all responsive classes (default is column on small screens) */
.flex-responsive-xs .flex-row,
.flex-responsive-sm .flex-row,
.flex-responsive-md .flex-row,
.flex-responsive-lg .flex-row,
.flex-responsive-xl .flex-row,
.flex-responsive-xxl .flex-row {
  flex-direction: column;
}

.flex-responsive-xs .flex-reverse,
.flex-responsive-sm .flex-reverse,
.flex-responsive-md .flex-reverse,
.flex-responsive-lg .flex-reverse,
.flex-responsive-xl .flex-reverse,
.flex-responsive-xxl .flex-reverse {
  flex-direction: column-reverse;
}

.flex-responsive-xs .flex-column,
.flex-responsive-sm .flex-column,
.flex-responsive-md .flex-column,
.flex-responsive-lg .flex-column,
.flex-responsive-xl .flex-column,
.flex-responsive-xxl .flex-column {
  flex-direction: row;
}

.flex-responsive-xs .flex-column-reverse,
.flex-responsive-sm .flex-column-reverse,
.flex-responsive-md .flex-column-reverse,
.flex-responsive-lg .flex-column-reverse,
.flex-responsive-xl .flex-column-reverse,
.flex-responsive-xxl .flex-column-reverse {
  flex-direction: row-reverse;
}

/* Responsive breakpoints - switch back to original direction at specified breakpoint */
@media (min-width: 576px) {
  .flex-responsive-xs .flex-row {
    flex-direction: row;
  }
  
  .flex-responsive-xs .flex-reverse {
    flex-direction: row-reverse;
  }
  
  .flex-responsive-xs .flex-column {
    flex-direction: column;
  }
  
  .flex-responsive-xs .flex-column-reverse {
    flex-direction: column-reverse;
  }
}

@media (min-width: 768px) {
  .flex-responsive-sm .flex-row {
    flex-direction: row;
  }
  
  .flex-responsive-sm .flex-reverse {
    flex-direction: row-reverse;
  }
  
  .flex-responsive-sm .flex-column {
    flex-direction: column;
  }
  
  .flex-responsive-sm .flex-column-reverse {
    flex-direction: column-reverse;
  }
}

@media (min-width: 992px) {
  .flex-responsive-md .flex-row {
    flex-direction: row;
  }
  
  .flex-responsive-md .flex-reverse {
    flex-direction: row-reverse;
  }
  
  .flex-responsive-md .flex-column {
    flex-direction: column;
  }
  
  .flex-responsive-md .flex-column-reverse {
    flex-direction: column-reverse;
  }
}

@media (min-width: 1200px) {
  .flex-responsive-lg .flex-row {
    flex-direction: row;
  }
  
  .flex-responsive-lg .flex-reverse {
    flex-direction: row-reverse;
  }
  
  .flex-responsive-lg .flex-column {
    flex-direction: column;
  }
  
  .flex-responsive-lg .flex-column-reverse {
    flex-direction: column-reverse;
  }
}

@media (min-width: 1400px) {
  .flex-responsive-xl .flex-row,
  .flex-responsive-xxl .flex-row {
    flex-direction: row;
  }
  
  .flex-responsive-xl .flex-reverse,
  .flex-responsive-xxl .flex-reverse {
    flex-direction: row-reverse;
  }
  
  .flex-responsive-xl .flex-column,
  .flex-responsive-xxl .flex-column {
    flex-direction: column;
  }
  
  .flex-responsive-xl .flex-column-reverse,
  .flex-responsive-xxl .flex-column-reverse {
    flex-direction: column-reverse;
  }
}
</style>