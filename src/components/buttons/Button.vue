<template>
  <button
    type="button"
    class="btn d-flex"
    :class="(outline ? `btn-outline-${color}` : `btn-${color} `)"

  >
    <i
      v-if="icon"
      class="bg-white far rounded-circle p-2"
      :class="[icon, color ? `text-${color}` : '']"
    ></i>
    <div class="d-flex align-items-center"><slot /></div>
  </button>
</template>

<script setup lang="ts">

// imports
// stores import
// components import
// model imports
import { EColor } from "@/enums/EColor";

// other imports
// props
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: EColor.Primary,
  },
  outline: {
    type: Boolean,
    default: false,
  },
});
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
