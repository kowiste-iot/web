<template>
  <div
    class="position-relative rounded"
    :class="`bg-${backgroundColor}`"
    style="height: 3rem; width: 3rem"
  >
    <div
      class="position-absolute rounded-circle circle"
      :class="`bg-${EColor.Primary}`"
      style="height: 0.8rem; width: 0.8rem"
    />
    <div
      class="position-absolute rounded-circle circleinv"
      :class="`bg-${EColor.Danger}`"
      style="height: 0.8rem; width: 0.8rem"
    />
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
import { EColor } from '@/enums/EColor'

// other imports
// props
const props = defineProps({
  backgroundColor: {
    type: String,
    default: EColor.Dark,
  },
})
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped>
.circle {
  animation: move 2s infinite;

}
.circleinv {
  animation: moveinv 2s infinite;
}

@keyframes move {
  0% {
    top: 1rem;
    left: 0.5rem;
  }
  25% {
    top: 1rem;
    left: 0.5rem;
  }
  50% {
    top: 1rem;
    left: 1.8rem;
  }
  75% {
    top: 1rem;
    left:  0.5rem;
  }
  100% {
    top: 1rem;
    left: 0.5rem;
  }
}
@keyframes moveinv {
  0% {
    top: 1rem;
    right: 0.5rem;
  }
  25% {
    top: 1rem;
    right: 0.5rem;
  }
  50% {
    top: 1rem;
    right: 1.8rem;
  }
  75% {
    top: 1rem;
    right:  0.5rem;
  }
  100% {
    top: 1rem;
    right: 0.5rem;
  }
}
</style>
