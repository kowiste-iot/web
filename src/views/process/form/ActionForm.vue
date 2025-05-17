<template>
  <InputCard
    class="full-height"
    :headerText="
      $t(edit ? 'action.form.titleUpdate' : 'action.form.titleCreate')
    "
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('asset.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('action.form.nameHolder')"
        type="text"
        :error="errors?.getError('name')"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('action.form.parent') }} </label>
      <MultiDropdown
        class="col-md-8"
        :options="availableParents"
        idField="id"
        labelField="name"
        :placeholder="$t('action.form.parentHolder')"
        :error="errors?.getError('parent')"
        v-model="selectedParent"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('action.form.description') }} </label>
      <InputText
        class="col-md-8"
        placeholder=""
        :rows="5"
        :error="errors?.getError('description')"
        v-model="form.description"
      />
    </div>
    <template #footer>
      <Button :color="edit ? EColor.Warning : EColor.Success" @click="save()">{{
        $t(edit ? 'actionGUI.update' : 'actionGUI.save')
      }}</Button>
      <Button :color="EColor.Secondary" outline @click="emit('close')">{{
        $t('actionGUI.cancel')
      }}</Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { ref, reactive, computed, onMounted, type PropType, watch } from 'vue'

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { type IAsset } from '@/features/asset/domain/asset'
import { useBasePage } from '@/composable/useBasePage'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import { Action, type IAction } from '@/features/action/domain/action'
import { ActionService } from '@/features/action/application/actionService'
import { ActionRepository } from '@/features/action/repository/actionRepository'
import InputText from '@/components/form/InputText.vue'

// other imports
// props
const props = defineProps({
  data: {
    type: Object as PropType<IAction>,
    default: {},
  },
  edit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  close: []
}>()
// data
const form = reactive<IAction>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? undefined,
  description: props.data?.description ?? undefined,
})
const assetStore = useAssetStore()
const selectedParent = ref({} as IAsset)

const errors = ref<ValidationError<IAction> | null>(new ValidationError())

//service
const { notificationService } = useBasePage()
const actionService = new ActionService(
  new ActionRepository(),
  notificationService
)
// computed
const availableParents = computed(() => {
  return assetStore.assets
})

// methods
async function save() {
  if (props.edit) {
    errors.value = await actionService.updateAction(form)
  } else {
    errors.value = await actionService.createAction(form)
  }
  if (errors.value?.hasErrors()) return
  emit('close')
}
// lifeCycle
onMounted(() => {
  if (props.edit && props.data.parent) {
    const parent = assetStore.getAssetById(props.data.parent)
    if (parent) {
      selectedParent.value = parent
    }
  }
})
// watch
watch(
  () => form,
  () => {
    errors.value = Action.validate(form)
  },
  {
    deep: true,
  }
)
watch(
  () => selectedParent.value,
  () => {
    if (selectedParent.value.id) {
      form.parent = selectedParent.value.id
    }
  }
)
</script>

<style scoped></style>
