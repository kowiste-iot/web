<template>
  <div
    class="position-relative rounded"
    :class="`bg-${backgroundColor}`"
    style="height: 2.5rem; width: 2.5rem"
  >
    <div
      class="position-absolute rounded-circle circle"
      :class="`bg-${ballColorLeft}`"
      style="height: 0.5rem; width: 0.5rem"
    />
    <div
      class="position-absolute rounded-circle circleinv"
      :class="`bg-${ballColorRight}`"
      style="height: 0.5rem; width: 0.5rem"
    />
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
import { EColor } from '@/features/shared/enum/EColor'

// other imports
// props
interface Props {
  backgroundColor?: EColor
  ballColorLeft?: EColor
  ballColorRight? : EColor
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: EColor.Menu,
  ballColorLeft: EColor.Primary,
  ballColorRight: EColor.Danger,
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
    left: 1.5rem;
  }
  75% {
    top: 1rem;
    left: 0.5rem;
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
    right: 1.5rem;
  }
  75% {
    top: 1rem;
    right: 0.5rem;
  }
  100% {
    top: 1rem;
    right: 0.5rem;
  }
}
</style>
