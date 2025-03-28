<template>
  <div class="row" :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RowAlignment, RowVerticalAlignment } from './model';



interface Props {
  align?: RowAlignment;
  valign?: RowVerticalAlignment;
}

const props = withDefaults(defineProps<Props>(), {
  align: undefined,
  valign: undefined
});

const classes = computed(() => {
  const classList = [];

  if (props.align) {
    classList.push(`justify-content-${props.align}`);
  }

  if (props.valign) {
    classList.push(`align-items-${props.valign}`);
  }

  return classList;
});
</script>

<style>
/* Base row styles */
.row {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-top: var(--size-100);
}

/* Alignment classes */
.justify-content-start {
  justify-content: flex-start;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-end {
  justify-content: flex-end;
}

.justify-content-between {
  justify-content: space-between;
}

.justify-content-around {
  justify-content: space-around;
}

.justify-content-evenly {
  justify-content: space-evenly;
}

.align-items-start {
  align-items: flex-start;
}

.align-items-center {
  align-items: center;
}

.align-items-end {
  align-items: flex-end;
}

.align-items-baseline {
  align-items: baseline;
}

.align-items-stretch {
  align-items: stretch;
}
</style>