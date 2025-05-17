<template>
  <Col :size="size" :breakpoint="EBreakpoint.LG" class="side-card slide-in">
    <div class="side-card-innner">
      <slot />
    </div>
  </Col>
</template>

<script setup lang="ts">
import { EBreakpoint, type ColSize } from '../layout/grid/model'
import Col from '../layout/grid/Col.vue'

// imports

// stores import
// components import

// model imports

// other imports
// props
interface Props {
  size?: ColSize
}

const props = withDefaults(defineProps<Props>(), {
  size: 6,
})

// data

// storage calls
// computed
// methods

// lifeCycle
// watch
</script>

<style scoped>
.slide-in {
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}
.side-card {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background-color: var(--layout-overlay);
}
.side-card-innner {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
