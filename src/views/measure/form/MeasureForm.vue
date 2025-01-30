<template>
  <InputCard
    class="h-100"
    :headerText="
      $t(edit ? 'measure.form.titleUpdate' : 'measure.form.titleCreate')
    "
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('measure.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('measure.form.nameHolder')"
        type="text"
        :error="errors['name']"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('measure.form.parent') }} </label>
      <MultiDropdown
        class="col-md-8"
        :options="assets"
        idField="id"
        labelField="name"
        :placeholder="$t('measure.form.parentHolder')"
        :error="errors['parent']"
        v-model="selectedParent"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('measure.form.description') }} </label>
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

// feauture imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import type { IAsset } from '@/features/asset/domain/asset'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { MeasureService } from '@/features/measure/application/measureService'
import { MeasureRepository } from '@/features/measure/repository/measureRepository'
import { useBasePage } from '@/composable/useBasePage'
import { Measure, type IMeasure } from '@/features/measure/domain/measure'
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import InputText from '@/components/form/InputText.vue'

// other imports
// props
const props = defineProps({
  data: {
    type: Object as PropType<IAsset>,
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
const form = reactive<IMeasure>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? '',
  description: props.data?.description ?? '',
})
const selectedParent = ref({} as IAsset)

const errors = ref<ValidationError<IMeasure>>({})

// service
const { notificationService } = useBasePage()
const measureService = new MeasureService(
  new MeasureRepository(),
  notificationService,
  useAssetStore()
)
// storage calls
const assetStore = useAssetStore()
// computed
const assets = computed(() => {
  return assetStore.assets
})

// methods
async function save() {
  if (props.edit) {
    await measureService.updateMeasure(form)
  } else {
    await measureService.createMeasure(form)
  }
  props.close()
}
// lifeCycle
onMounted(() => {
  if (props.edit && props.data.parent) {
    const parent = assetStore.getAssetById(props.data.parent)
    if (parent) {
      selectedParent.value = parent
    }
  }
  useAssetStore().fetchAssets()
})
// watch
watch(
  () => form,
  () => {
    errors.value = Measure.validate(form)
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
