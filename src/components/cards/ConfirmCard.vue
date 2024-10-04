<template>
  <div class="modal">
    <!-- Modal content -->
    <div
      class="bg-light m-auto p-3 border-secondary rounded col-lg-3 col-md-4 col-sm-5"
    >
      <div class="d-flex justify-content-center">
        <FIcon
          :class="`text-${getIcon(action).color}`"
          :icon="getIcon(action).icon"
          style="height: 3rem"
        />
      </div>
      <div class="my-5">
        <slot />
      </div>

      <div class="offset-md-3 col-md-6">
        <div class="d-flex flex-column justify-content-center">
          <Button :color="getIcon(action).color" @click="onAction()">
            <div class="w-100 text-center">{{ actionText }}</div>
          </Button>

          <Button
            class="my-2"
            :color="EColor.Secondary"
            outline
            @click="onCancel()"
          >
            <div class="w-100 text-center">Cancel</div>
          </Button>
        </div>
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
    type: String as PropType<EActionGUI>,
    default: EActionGUI.Success,
  },
  actionText: {
    type: String,
    default: 'Save',
  },
  onAction: {
    type: Function,
    default: function () {},
  },
  onCancel: {
    type: Function,
    default: function () {},
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
      inner.value.icon = EIcon.ConfirmationSucess
      break
    case EActionGUI.Info:
      inner.value.color = EColor.Info
      inner.value.icon = EIcon.ConfirmationInfo
      break
    case EActionGUI.Warning:
      inner.value.color = EColor.Warning
      inner.value.icon = EIcon.ConfirmationWarning
      break
    case EActionGUI.Danger:
      inner.value.color = EColor.Danger
      inner.value.icon = EIcon.ConfirmationCancel
      break
  }
  return inner.value
}
// lifeCycle
// watch
</script>

<style scoped>
/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 5rem; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.5); /* Black w/ opacity */
}
</style>
