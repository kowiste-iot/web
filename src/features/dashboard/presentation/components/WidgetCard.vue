<template>
  <Card>
    <Flex column>
      <Flex :justify="EFlexJustify.Center">
        <slot></slot>
      </Flex>
      <div v-if="data.showLabel || data.showEmotion" class="border-top">
        <Flex>
          <div v-if="data.showLabel" class="footer-text">{{ data.label }}</div>
          <FIcon
            v-if="data.showEmotion"
            class="footer-icon"
            :class="`text-${
              data.trueEmotion
                ? !measureCondition
                  ? EColor.Success
                  : EColor.Danger
                : measureCondition
                ? EColor.Success
                : EColor.Danger
            }`"
            :icon="
              data.trueEmotion
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
        </Flex>
      </div>
    </Flex>
  </Card>
</template>

<script setup lang="ts">
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import type { IWidgetData } from '@/features/dashboard/domain/widget'
import Card from '@/components/cards/Card.vue'
import Flex from '@/components/layout/Flex.vue'
import { EFlexJustify } from '@/components/layout/EFlex'

// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  data: IWidgetData
  measureCondition: boolean
}
const props = defineProps<Props>()
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped>
.footer-icon {
  padding-top: var(--size-100);
}
.footer-text {
  flex: 1;
}
</style>
