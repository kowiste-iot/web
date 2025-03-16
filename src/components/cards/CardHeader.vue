<template>
  <Flex class="header-card" :justify="EFlexJustify.Between">
    <Flex>
      <FIcon class="icon-header" :icon="headerIcon" />
      {{ headerText }}
    </Flex>

    <Button
      :icon="EIcon.Add"
      :color="EColor.Success"
      compact
      @click="emit('click')"
    >
      {{ buttonText }}</Button
    ></Flex
  >
</template>

<script setup lang="ts">
// imports

// stores import
// components import
// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EFlexJustify } from '../layout/EFlex'
import Flex from '../layout/Flex.vue'
import Button from '../buttons/Button.vue'

// other imports
// props
interface Props {
  headerText: string
  headerIcon: EIcon
  buttonText: string
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<{
  click: []
}>()

// data

// storage calls
// computed
// methods

// lifeCycle
// watch
</script>

<style scoped>
.icon-header {
  padding-right: var(--size-200);
  padding-top: var(--size-050);
}
.header-card {
  padding: var(--size-100);
}
</style>
