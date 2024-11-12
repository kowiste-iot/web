<template>
  <div class="border rounded h-100 d-flex flex-column">
    <div class="d-flex justify-content-center">
      <div
        v-if="!data.options?.showText"
        class="border rounded m-3 w-50 py-3"
        :class="`bg-${measure ? EColor.Success : EColor.Danger}`"
      />
      <div v-else class="fs-1">
        {{ measure ? data.options.trueText : data.options.falseText }}
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
import { EIcon } from '@/enums/gui/EIcon';
// model imports
// other imports
// props
const props = defineProps({
  measure: {
    type: Boolean,
    default: false,
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
