<template>
  <div role="button" @click="emit('click', data)">
    <Card>
      <Flex class="widget-card-layout" :justify="EFlexJustify.Center" column>
        <FIcon
          class="mb-2 opacity-50"
          :class="`text-${EColor.Secondary}`"
          :icon="data.icon"
          style="height: 5rem"
        />
        <div class="">
          <div class="text-start fw-bold" style="font-size: 1.2rem">
            {{ data.name }}
          </div>
          <div class="text-center">{{ data.description }}</div>
        </div>
      </Flex>
    </Card>
  </div>
</template>
<script setup lang="ts">
import Card from '@/components/cards/Card.vue'
import { EFlexJustify } from '@/components/layout/EFlex'
import Flex from '@/components/layout/Flex.vue'
import { EColor } from '@/features/shared/enum/EColor'
import type { IWidgetType } from '@/features/shared/domain/widgetType'

interface Props {
  data: IWidgetType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [data: IWidgetType]
}>()
</script>
<style scoped>
.widget-card-layout {
  padding: var(--size-400) var(--size-100);
}
</style>
