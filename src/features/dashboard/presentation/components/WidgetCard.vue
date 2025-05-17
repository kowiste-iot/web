<template>
  <Card id="widget-card" class="widget-card" showFooter>
    <Flex id="widget-card-flex" column class="full-height">
      <Flex
        id="widget-card-body"
        :justify="EFlexJustify.Center"
        class="widget-card-layout"
      >
        <slot></slot>
      </Flex>
    </Flex>
    <template #footer>
      <div
        v-if="data.showLabel || data.showEmotion"
        id="widget-card-footer"
        class="footer-layout"
      >
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
    </template>
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

.widget-card-layout {
  flex: 1;
}
.footer-layout {
  width: 100%;
  border-top: var(--border-width) solid var(--border-color);
}
.footer-icon {
  padding-top: var(--size-050);
}
.footer-text {
  flex: 1;
}
</style>
