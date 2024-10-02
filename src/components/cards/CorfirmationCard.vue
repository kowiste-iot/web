<template>
  <div class="position-relative w-100">
    <div
      class="card bg-light position-absolute top-0 translate-middle start-50"
    >
      <div class="card-header d-flex justify-content-center">
        <FIcon :icon="getIcon(action).icon" />
      </div>
      <div class="card-body">
        <slot />
      </div>
      <div class="card-footer d-flex flex-column">
        <Button class="my-4" :color="getIcon(action).color" @click="">{{
          actionText
        }}</Button>
        <Button class="my-4" :color="EColor.Secondary" outline @click=""
          >Cancel</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { type PropType, ref } from 'vue'

// stores import
// components import
import Button from '@/components/buttons/Button.vue'

// model imports
import { EActionGUI } from '@/enums/gui/EActionGUI'
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'

// other imports
// props
const props = defineProps({
  headerText: {
    type: String,
  },
  action: {
    type: Object as PropType<EActionGUI>,
    default: EActionGUI.Success,
  },
  actionText: {
    type: String,
    default: 'Save',
  },
})
// data
interface IAction {
  icon: EIcon
  color: EColor
}
let inner = ref({} as IAction)
// storage calls
// computed
// methods
function getIcon(data: EActionGUI): IAction {
  switch (data) {
    case EActionGUI.Success:
      inner.value.color = EColor.Success
      inner.value.icon = EIcon.Success
      break
    case EActionGUI.Info:
      inner.value.color = EColor.Info
      inner.value.icon = EIcon.Info
      break
    case EActionGUI.Warning:
      inner.value.color = EColor.Warning
      inner.value.icon = EIcon.Alert
      break
    case EActionGUI.Danger:
      inner.value.color = EColor.Danger
      inner.value.icon = EIcon.Cancel
      break
  }
  return inner.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
