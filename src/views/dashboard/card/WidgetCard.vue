<template>
  <div class="border rounded h-100 d-flex flex-column">
    <div class="d-flex w-100 justify-content-center">
      <slot ></slot>
    </div>
    <div class="border-top">
      <div class="d-flex px-1">
        <div v-if="data.showLabel" class="flex-fill">{{ data.label }}</div>
        <FIcon
          v-if="data.showEmotion"
          class="pt-1"
          :class="`text-${
            data.options.trueEmotion
              ? !measureCondition
                ? EColor.Success
                : EColor.Danger
              : measureCondition
              ? EColor.Success
              : EColor.Danger
          }`"
          :icon="
            data.options.trueEmotion
              ? !measureCondition
                ? EIcon.Smile
                : EIcon.Sad
              : measureCondition
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
import { EColor } from '@/enums/gui/EColor';
import { EIcon } from '@/enums/gui/EIcon';
import type { IWidgetData } from '@/model/widget/widget';

// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  data: IWidgetData;
  measureCondition: boolean;
}
const props = defineProps<Props>();
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
