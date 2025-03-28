<template>
  {{ fontSize}}
  <WidgetCard
    :data="data"
    :measureCondition="modelValue == data.options.conditionText"
   
  >
    <div ref="parent" class=" w-100 h-100 flex items-center justify-center">
      <div
        ref="textRef"
        class="font-bold text-center"
        :style="{ fontSize: `${fontSize}px` }"
      >
        {{ modelValue }}
      </div>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import\

import type { IWidgetData } from '@/features/dashboard/domain/widget';
import WidgetCard from '../WidgetCard.vue';
// model imports
// other imports
// props
interface Props {
  data: IWidgetData;
}
const props = defineProps<Props>();
const modelValue = defineModel<string>();
// data

// storage calls
// computed
// methods
// lifeCycle
// watch
import { ref, onMounted, nextTick, onUpdated } from 'vue';

const textRef = ref<HTMLDivElement | null>(null);
const parent = ref<HTMLDivElement | null>(null);
const fontSize = ref(100);

async function adjustTextSize() {
  await nextTick();
  console.log('sdf');

  if (!textRef.value) return;

  const text = textRef.value;
  const container = parent.value;

  if (!container) return;
  fontSize.value = 1;
  // Container dimensions
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  console.log(parent.value,containerHeight, containerWidth);

  if (containerWidth <= 0 || containerHeight <= 0) {
    return;
  }
  console.log('jhj');

  let count = 0;
  while (true) {
    await nextTick();
    count++;
    if (count > 500) break;
    if (
      text.clientWidth >= containerWidth ||
      text.clientHeight >= containerHeight
    ) {
      console.log(
        'there',
        count,
        text.clientHeight,
        containerHeight,
        fontSize.value
      );
      break;
    } else {
      fontSize.value++;
      console.log(
        'here',
        count,
        text.clientHeight,
        containerHeight,
        fontSize.value
      );
      
    }
  }
}

onMounted(() => adjustTextSize());
onUpdated(() => {
  adjustTextSize();
});
</script>

<style scoped>
div {
  overflow: hidden; /* Prevent overflow */
  display: flex;
  align-items: center; /* Vertically center the text */
  justify-content: center; /* Horizontally center the text */
}
</style>
