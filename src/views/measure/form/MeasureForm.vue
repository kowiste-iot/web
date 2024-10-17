<template>
  <InputCard class="h-100" headerText="Test Card" :icon="EIcon.Death">
    hello
    <template #footer>
      <Button :color="EColor.Success">Save</Button>
      <Button :color="EColor.Secondary" outline @click="close()">Cancel</Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  close: {
    type: Function,
    default: function () {},
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
