<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ColOffset, ColOrder, ColSize, EBreakpoint } from './model'
// Enums must be outside the setup script

interface Props {
  // Default size (xs)
  size?: ColSize
  offset?: ColOffset
  order?: ColOrder

  // EBreakpoint specific
  breakpoint?: EBreakpoint
  smSize?: ColSize
  smOffset?: ColOffset
  smOrder?: ColOrder

  mdSize?: ColSize
  mdOffset?: ColOffset
  mdOrder?: ColOrder

  lgSize?: ColSize
  lgOffset?: ColOffset
  lgOrder?: ColOrder

  xlSize?: ColSize
  xlOffset?: ColOffset
  xlOrder?: ColOrder

  xxlSize?: ColSize
  xxlOffset?: ColOffset
  xxlOrder?: ColOrder
}

const props = defineProps<Props>()

const classes = computed(() => {
  const classList = []

  // Default size (no breakpoint prefix)
  if (props.size) {
    if (props.size === 'auto') {
      classList.push('col-auto')
    } else {
      classList.push(`col-${props.size}`)
    }
  } else if (
    !props.breakpoint &&
    !props.smSize &&
    !props.mdSize &&
    !props.lgSize &&
    !props.xlSize &&
    !props.xxlSize
  ) {
    // If no size is specified anywhere, use default col
    classList.push('col')
  }

  if (props.offset) {
    classList.push(`offset-${props.offset}`)
  }

  if (props.order) {
    classList.push(`order-${props.order}`)
  }

  // Handle breakpoint + size - this will now apply the size only at the specified breakpoint and up
  // For smaller screens, it will stack (full width)
  if (props.breakpoint && props.size) {
    if (props.size === 'auto') {
      classList.push(`col-${props.breakpoint}-auto`)
      classList.push('col-12') // Full width on smaller screens
    } else {
      classList.push(`col-${props.breakpoint}-${props.size}`)
      classList.push('col-12') // Full width on smaller screens
    }
  }

  // SM breakpoint
  if (props.smSize) {
    if (props.smSize === 'auto') {
      classList.push('col-sm-auto')
    } else {
      classList.push(`col-sm-${props.smSize}`)
    }
  }

  if (props.smOffset) {
    classList.push(`offset-sm-${props.smOffset}`)
  }

  if (props.smOrder) {
    classList.push(`order-sm-${props.smOrder}`)
  }

  // MD breakpoint
  if (props.mdSize) {
    if (props.mdSize === 'auto') {
      classList.push('col-md-auto')
    } else {
      classList.push(`col-md-${props.mdSize}`)
    }
  }

  if (props.mdOffset) {
    classList.push(`offset-md-${props.mdOffset}`)
  }

  if (props.mdOrder) {
    classList.push(`order-md-${props.mdOrder}`)
  }

  // LG breakpoint
  if (props.lgSize) {
    if (props.lgSize === 'auto') {
      classList.push('col-lg-auto')
    } else {
      classList.push(`col-lg-${props.lgSize}`)
    }
  }

  if (props.lgOffset) {
    classList.push(`offset-lg-${props.lgOffset}`)
  }

  if (props.lgOrder) {
    classList.push(`order-lg-${props.lgOrder}`)
  }

  // XL breakpoint
  if (props.xlSize) {
    if (props.xlSize === 'auto') {
      classList.push('col-xl-auto')
    } else {
      classList.push(`col-xl-${props.xlSize}`)
    }
  }

  if (props.xlOffset) {
    classList.push(`offset-xl-${props.xlOffset}`)
  }

  if (props.xlOrder) {
    classList.push(`order-xl-${props.xlOrder}`)
  }

  // XXL breakpoint
  if (props.xxlSize) {
    if (props.xxlSize === 'auto') {
      classList.push('col-xxl-auto')
    } else {
      classList.push(`col-xxl-${props.xxlSize}`)
    }
  }

  if (props.xxlOffset) {
    classList.push(`offset-xxl-${props.xxlOffset}`)
  }

  if (props.xxlOrder) {
    classList.push(`order-xxl-${props.xxlOrder}`)
  }

  return classList
})
</script>

<style>
/* Base column styles */
[class*='col-'] {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.col {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
}

.col-auto {
  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
}

/* Column sizes */
.col-1 {
  flex: 0 0 8.333333%;
  max-width: 8.333333%;
}
.col-2 {
  flex: 0 0 16.666667%;
  max-width: 16.666667%;
}
.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
}
.col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}
.col-5 {
  flex: 0 0 41.666667%;
  max-width: 41.666667%;
}
.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}
.col-7 {
  flex: 0 0 58.333333%;
  max-width: 58.333333%;
}
.col-8 {
  flex: 0 0 66.666667%;
  max-width: 66.666667%;
}
.col-9 {
  flex: 0 0 75%;
  max-width: 75%;
}
.col-10 {
  flex: 0 0 83.333333%;
  max-width: 83.333333%;
}
.col-11 {
  flex: 0 0 91.666667%;
  max-width: 91.666667%;
}
.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

/* Offset classes */
.offset-1 {
  margin-left: 8.333333%;
}
.offset-2 {
  margin-left: 16.666667%;
}
.offset-3 {
  margin-left: 25%;
}
.offset-4 {
  margin-left: 33.333333%;
}
.offset-5 {
  margin-left: 41.666667%;
}
.offset-6 {
  margin-left: 50%;
}
.offset-7 {
  margin-left: 58.333333%;
}
.offset-8 {
  margin-left: 66.666667%;
}
.offset-9 {
  margin-left: 75%;
}
.offset-10 {
  margin-left: 83.333333%;
}
.offset-11 {
  margin-left: 91.666667%;
}

/* Order classes */
.order-first {
  order: -1;
}
.order-0 {
  order: 0;
}
.order-1 {
  order: 1;
}
.order-2 {
  order: 2;
}
.order-3 {
  order: 3;
}
.order-4 {
  order: 4;
}
.order-5 {
  order: 5;
}
.order-last {
  order: 6;
}

/* Responsive breakpoints */
@media (min-width: 576px) {
  .col-sm-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .col-sm-1 {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
  }
  .col-sm-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
  }
  .col-sm-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-sm-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .col-sm-5 {
    flex: 0 0 41.666667%;
    max-width: 41.666667%;
  }
  .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .col-sm-7 {
    flex: 0 0 58.333333%;
    max-width: 58.333333%;
  }
  .col-sm-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  .col-sm-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .col-sm-10 {
    flex: 0 0 83.333333%;
    max-width: 83.333333%;
  }
  .col-sm-11 {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
  }
  .col-sm-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .offset-sm-0 {
    margin-left: 0;
  }
  .offset-sm-1 {
    margin-left: 8.333333%;
  }
  .offset-sm-2 {
    margin-left: 16.666667%;
  }
  .offset-sm-3 {
    margin-left: 25%;
  }
  .offset-sm-4 {
    margin-left: 33.333333%;
  }
  .offset-sm-5 {
    margin-left: 41.666667%;
  }
  .offset-sm-6 {
    margin-left: 50%;
  }
  .offset-sm-7 {
    margin-left: 58.333333%;
  }
  .offset-sm-8 {
    margin-left: 66.666667%;
  }
  .offset-sm-9 {
    margin-left: 75%;
  }
  .offset-sm-10 {
    margin-left: 83.333333%;
  }
  .offset-sm-11 {
    margin-left: 91.666667%;
  }

  .order-sm-first {
    order: -1;
  }
  .order-sm-0 {
    order: 0;
  }
  .order-sm-1 {
    order: 1;
  }
  .order-sm-2 {
    order: 2;
  }
  .order-sm-3 {
    order: 3;
  }
  .order-sm-4 {
    order: 4;
  }
  .order-sm-5 {
    order: 5;
  }
  .order-sm-last {
    order: 6;
  }
}

@media (min-width: 768px) {
  .col-md-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .col-md-1 {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
  }
  .col-md-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
  }
  .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .col-md-5 {
    flex: 0 0 41.666667%;
    max-width: 41.666667%;
  }
  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .col-md-7 {
    flex: 0 0 58.333333%;
    max-width: 58.333333%;
  }
  .col-md-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  .col-md-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .col-md-10 {
    flex: 0 0 83.333333%;
    max-width: 83.333333%;
  }
  .col-md-11 {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
  }
  .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .offset-md-0 {
    margin-left: 0;
  }
  .offset-md-1 {
    margin-left: 8.333333%;
  }
  .offset-md-2 {
    margin-left: 16.666667%;
  }
  .offset-md-3 {
    margin-left: 25%;
  }
  .offset-md-4 {
    margin-left: 33.333333%;
  }
  .offset-md-5 {
    margin-left: 41.666667%;
  }
  .offset-md-6 {
    margin-left: 50%;
  }
  .offset-md-7 {
    margin-left: 58.333333%;
  }
  .offset-md-8 {
    margin-left: 66.666667%;
  }
  .offset-md-9 {
    margin-left: 75%;
  }
  .offset-md-10 {
    margin-left: 83.333333%;
  }
  .offset-md-11 {
    margin-left: 91.666667%;
  }

  .order-md-first {
    order: -1;
  }
  .order-md-0 {
    order: 0;
  }
  .order-md-1 {
    order: 1;
  }
  .order-md-2 {
    order: 2;
  }
  .order-md-3 {
    order: 3;
  }
  .order-md-4 {
    order: 4;
  }
  .order-md-5 {
    order: 5;
  }
  .order-md-last {
    order: 6;
  }
}

@media (min-width: 992px) {
  .col-lg-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .col-lg-1 {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
  }
  .col-lg-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
  }
  .col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-lg-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .col-lg-5 {
    flex: 0 0 41.666667%;
    max-width: 41.666667%;
  }
  .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .col-lg-7 {
    flex: 0 0 58.333333%;
    max-width: 58.333333%;
  }
  .col-lg-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  .col-lg-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .col-lg-10 {
    flex: 0 0 83.333333%;
    max-width: 83.333333%;
  }
  .col-lg-11 {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
  }
  .col-lg-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .offset-lg-0 {
    margin-left: 0;
  }
  .offset-lg-1 {
    margin-left: 8.333333%;
  }
  .offset-lg-2 {
    margin-left: 16.666667%;
  }
  .offset-lg-3 {
    margin-left: 25%;
  }
  .offset-lg-4 {
    margin-left: 33.333333%;
  }
  .offset-lg-5 {
    margin-left: 41.666667%;
  }
  .offset-lg-6 {
    margin-left: 50%;
  }
  .offset-lg-7 {
    margin-left: 58.333333%;
  }
  .offset-lg-8 {
    margin-left: 66.666667%;
  }
  .offset-lg-9 {
    margin-left: 75%;
  }
  .offset-lg-10 {
    margin-left: 83.333333%;
  }
  .offset-lg-11 {
    margin-left: 91.666667%;
  }

  .order-lg-first {
    order: -1;
  }
  .order-lg-0 {
    order: 0;
  }
  .order-lg-1 {
    order: 1;
  }
  .order-lg-2 {
    order: 2;
  }
  .order-lg-3 {
    order: 3;
  }
  .order-lg-4 {
    order: 4;
  }
  .order-lg-5 {
    order: 5;
  }
  .order-lg-last {
    order: 6;
  }
}

@media (min-width: 1200px) {
  .col-xl-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .col-xl-1 {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
  }
  .col-xl-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
  }
  .col-xl-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-xl-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .col-xl-5 {
    flex: 0 0 41.666667%;
    max-width: 41.666667%;
  }
  .col-xl-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .col-xl-7 {
    flex: 0 0 58.333333%;
    max-width: 58.333333%;
  }
  .col-xl-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  .col-xl-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .col-xl-10 {
    flex: 0 0 83.333333%;
    max-width: 83.333333%;
  }
  .col-xl-11 {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
  }
  .col-xl-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .offset-xl-0 {
    margin-left: 0;
  }
  .offset-xl-1 {
    margin-left: 8.333333%;
  }
  .offset-xl-2 {
    margin-left: 16.666667%;
  }
  .offset-xl-3 {
    margin-left: 25%;
  }
  .offset-xl-4 {
    margin-left: 33.333333%;
  }
  .offset-xl-5 {
    margin-left: 41.666667%;
  }
  .offset-xl-6 {
    margin-left: 50%;
  }
  .offset-xl-7 {
    margin-left: 58.333333%;
  }
  .offset-xl-8 {
    margin-left: 66.666667%;
  }
  .offset-xl-9 {
    margin-left: 75%;
  }
  .offset-xl-10 {
    margin-left: 83.333333%;
  }
  .offset-xl-11 {
    margin-left: 91.666667%;
  }

  .order-xl-first {
    order: -1;
  }
  .order-xl-0 {
    order: 0;
  }
  .order-xl-1 {
    order: 1;
  }
  .order-xl-2 {
    order: 2;
  }
  .order-xl-3 {
    order: 3;
  }
  .order-xl-4 {
    order: 4;
  }
  .order-xl-5 {
    order: 5;
  }
  .order-xl-last {
    order: 6;
  }
}

@media (min-width: 1400px) {
  .col-xxl-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .col-xxl-1 {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
  }
  .col-xxl-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
  }
  .col-xxl-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-xxl-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .col-xxl-5 {
    flex: 0 0 41.666667%;
    max-width: 41.666667%;
  }
  .col-xxl-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .col-xxl-7 {
    flex: 0 0 58.333333%;
    max-width: 58.333333%;
  }
  .col-xxl-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  .col-xxl-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .col-xxl-10 {
    flex: 0 0 83.333333%;
    max-width: 83.333333%;
  }
  .col-xxl-11 {
    flex: 0 0 91.666667%;
    max-width: 91.666667%;
  }
  .col-xxl-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .offset-xxl-0 {
    margin-left: 0;
  }
  .offset-xxl-1 {
    margin-left: 8.333333%;
  }
  .offset-xxl-2 {
    margin-left: 16.666667%;
  }
  .offset-xxl-3 {
    margin-left: 25%;
  }
  .offset-xxl-4 {
    margin-left: 33.333333%;
  }
  .offset-xxl-5 {
    margin-left: 41.666667%;
  }
  .offset-xxl-6 {
    margin-left: 50%;
  }
  .offset-xxl-7 {
    margin-left: 58.333333%;
  }
  .offset-xxl-8 {
    margin-left: 66.666667%;
  }
  .offset-xxl-9 {
    margin-left: 75%;
  }
  .offset-xxl-10 {
    margin-left: 83.333333%;
  }
  .offset-xxl-11 {
    margin-left: 91.666667%;
  }

  .order-xxl-first {
    order: -1;
  }
  .order-xxl-0 {
    order: 0;
  }
  .order-xxl-1 {
    order: 1;
  }
  .order-xxl-2 {
    order: 2;
  }
  .order-xxl-3 {
    order: 3;
  }
  .order-xxl-4 {
    order: 4;
  }
  .order-xxl-5 {
    order: 5;
  }
  .order-xxl-last {
    order: 6;
  }
}
</style>
