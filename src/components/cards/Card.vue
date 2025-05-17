<template>
  <Flex column class="custom-card" fullHeight :justify="EFlexJustify.Between">
    <Flex
      v-if="showHeader"
      class="custom-header"
      :justify="EFlexJustify.Between"
    >
      <div v-if="headerText">{{ headerText }}</div>
      <FIcon v-if="headerText && icon" :icon="icon" />
      <slot v-else name="header" />
    </Flex>
    <div class="custom-body">
      <slot />
    </div>

    <Flex
      v-if="showFooter"
      class="custom-footer"
      reverse
      :justify="EFlexJustify.Start"
      :gap="2"
    >
      <slot name="footer"></slot>
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
import { EFlexJustify } from '../layout/EFlex'
import Flex from '../layout/Flex.vue'

// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  headerText?: string
  icon?: string
  showHeader?: boolean
  showFooter?: boolean
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
.custom-card {
  min-height: auto;
  height: 100%;
  background-color: var(--layout-card);
  border-radius: var(--border-md);
  box-shadow: var(--size-010) var(--size-010) var(--size-010) var(--size-010)
    var(--layout-card-shadow);
}
.custom-header {
  padding: var(--size-100);
  border-bottom: var(--border-width) solid var(--border-color);
}
.custom-body {
  flex: 1;
  min-inline-size: auto;
}
.custom-footer {
  padding: var(--size-100);
}
</style>
