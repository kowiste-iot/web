<template>
  <InputCard
    class="h-100"
    :headerText="$t(edit ? 'alert.form.titleUpdate' : 'alert.form.titleCreate')"
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('alert.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('alert.form.nameHolder')"
        type="text"
        :error="errors['name']"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('alert.form.parent') }} </label>
      <MultiDropdown
        class="col-md-8"
        :options="availableParents"
        idField="id"
        labelField="name"
        :placeholder="$t('alert.form.parentHolder')"
        :error="errors['parent']"
        v-model="selectedParent"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('alert.form.description') }} </label>
      <InputText
        class="col-md-8"
        placeholder=""
        :rows="5"
        :error="errors['description']"
        v-model="form.description"
      />
    </div>
    <template #footer>
      <Button :color="edit ? EColor.Warning : EColor.Success" @click="save()">{{
        $t(edit ? 'actionGUI.update' : 'actionGUI.save')
      }}</Button>
      <Button :color="EColor.Secondary" outline @click="close()">{{
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
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import { Alert, type IAlert } from '@/features/alert/domain/alert'
import { AlertService } from '@/features/alert/application/alertService'
import { AlertRepository } from '@/features/alert/repository/alertRepository'
import InputText from '@/components/form/InputText.vue'

// other imports
// props
const props = defineProps({
  data: {
    type: Object as PropType<IAlert>,
    default: {},
  },
  edit: {
    type: Boolean,
    default: false,
  },
  close: {
    type: Function,
    default: function () {},
  },
})
// data
const form = reactive<IAlert>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? undefined,
  description: props.data?.description ?? undefined,
})
const assetStore = useAssetStore()
const selectedParent = ref({} as IAsset)
const errors = ref<ValidationError<IAlert>>({})
//service
const { notificationService } = useBasePage()
const alertService = new AlertService(
  new AlertRepository(),
  notificationService
)
// computed
// Add a new computed property to filter out the current asset
const availableParents = computed(() => {
  return assetStore.assets
})

// methods
async function save() {
  let ok = false
  if (props.edit) {
    ok = await alertService.updateAlert(form)
  } else {
    ok = await alertService.createAlert(form)
  }
  if (!ok) return
  props.close()
}
// lifeCycle
onMounted(() => {
  assetStore.fetchAssets()
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
    errors.value = Alert.validate(form)
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
