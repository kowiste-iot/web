<template>
  <Modal>
    <Card class="offset-md-4 col-md-4 mt-5">
      <Flex :justify="EFlexJustify.Center">
        <FIcon
          :class="`text-${getIcon(action).color}`"
          :icon="getIcon(action).icon"
          style="height: 3rem"
        />
      </Flex>
      <div class="default-content">
        <slot />
      </div>

      <Flex reverse :justify="EFlexJustify.Start" :gap="2">
        <div>
          <Button :color="getIcon(action).color" @click="$emit('action')">
            {{ actionText }}
          </Button>
        </div>
        <div>
          <Button :color="EColor.Secondary" outline @click="$emit('cancel')">
            {{ $t('actionGUI.cancel') }}
          </Button>
        </div>
      </Flex>
    </Card>
  </Modal>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
// components import
import Button from '@/components/buttons/Button.vue'
import Modal from '@/components/layout/Modal.vue'
// model imports
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import Flex from '../layout/Flex.vue'
import { EFlexJustify } from '../layout/EFlex'
import Card from './Card.vue'

// other imports
// props
interface Props {
  headerText?: string
  action?: EActionGUI
  actionText?: string
}
const props = withDefaults(defineProps<Props>(), {
  action: EActionGUI.Success,
  actionText: 'Save',
})
const emit = defineEmits<{
  cancel: []
  action: []
}>()

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
.default-content {
  margin-block: var(--size-500);
}
</style>
