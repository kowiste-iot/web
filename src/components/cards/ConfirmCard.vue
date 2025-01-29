<template>
  <Modal>
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
            <div class="w-100 text-center">{{ $t('actionGUI.cancel') }}</div>
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
// components import
import Button from '@/components/buttons/Button.vue'
import Modal from '@/components/cards/Modal.vue'
// model imports
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'

// other imports
// props
interface Props {
  headerText?: string
  action?: EActionGUI
  actionText?: string
  onAction?: Function
  onCancel?: Function
}
const props = withDefaults(defineProps<Props>(), {
  action: EActionGUI.Success,
  actionText: 'Save',
  onAction: function () {},
  onCancel: function () {},
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

<style scoped></style>
