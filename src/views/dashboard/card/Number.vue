<template>
  <div class="border rounded h-100 d-flex flex-column">
    <div class="d-flex justify-content-center">
      <div class="fs-1 position-relative">
        {{ measure.toFixed(data.options.showDecimal ? 2 : 0) }}
        <div
          v-if="data.options.showUnit"
          class="position-absolute bottom-0 start-100 fs-6 ms-2"
        >
          {{ data.options.unit }}
        </div>
      </div>
    </div>
    <div class="border-top">
      <div class="d-flex px-1">
        <div v-if="data.showLabel" class="flex-fill">{{ data.label }}</div>
        <FIcon
          v-if="data.showEmotion"
          class="pt-1"
          :class="`text-${
            data.options.trueEmotion
              ? !measure
                ? EColor.Success
                : EColor.Danger
              : measure
              ? EColor.Success
              : EColor.Danger
          }`"
          :icon="
            data.options.trueEmotion
              ? !measure
                ? EIcon.Smile
                : EIcon.Sad
              : measure
              ? EIcon.Smile
              : EIcon.Sad
          "
          role="button"
          style="height: 1rem"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import\

import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// model imports
// other imports
// props
const props = defineProps({
  measure: {
    type: Number,
    default: 0,
  },
  data: {
    type: Object,
    default: {},
  },
})
// data

// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
