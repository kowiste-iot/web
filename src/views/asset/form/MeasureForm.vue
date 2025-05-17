<template>
  <InputCard
    class="full-height"
    :headerText="
      $t(edit ? 'measure.form.titleUpdate' : 'measure.form.titleCreate')
    "
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <Flex class="pt-2" column :gap="2">
      <label>{{ $t('measure.form.name') }} </label>
      <Input
        :placeholder="$t('measure.form.nameHolder')"
        type="text"
        :error="errors?.getError('name')"
        v-model="form.name"
      />
    </Flex>
    <Flex class="pt-2" column :gap="2">
      <label>{{ $t('measure.form.parent') }} </label>
      <DropDown
        :options="assets"
        labelField="name"
        valueField="id"
        :placeholder="$t('measure.form.parentHolder')"
        :error="errors?.getError('parent')"
        v-model="selectedParent"
      />
    </Flex>
    <Flex class="pt-2" column :gap="2">
      <label>{{ $t('measure.form.description') }} </label>
      <InputText
        placeholder=""
        :rows="5"
        :error="errors?.getError('description')"
        v-model="form.description"
      />
    </Flex>

    <div class="row mb-3"></div>
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

// feauture imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import type { IAsset } from '@/features/asset/domain/asset'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { MeasureService } from '@/features/measure/application/measureService'
import { MeasureRepository } from '@/features/measure/repository/measureRepository'
import { useBasePage } from '@/composable/useBasePage'
import { Measure, type IMeasure } from '@/features/measure/domain/measure'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import InputText from '@/components/form/InputText.vue'
import DropDown from '@/components/form/DropDown.vue'
import Flex from '@/components/layout/Flex.vue'

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
})
const emit = defineEmits<{
  close: []
}>()
// data
const form = reactive<IMeasure>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? '',
  description: props.data?.description ?? '',
})
const selectedParent = ref('')

const errors = ref<ValidationError<IMeasure> | null>(new ValidationError())

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
    errors.value = await measureService.updateMeasure(form)
  } else {
    errors.value = await measureService.createMeasure(form)
  }

  if (errors.value?.hasErrors()) return
  emit('close')
}
// lifeCycle
onMounted(() => {
  if (props.edit && props.data.parent) {
    const parent = assetStore.getAssetById(props.data.parent)
    if (parent) {
      selectedParent.value = parent.id
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

    if (selectedParent.value) {
      form.parent = selectedParent.value
    }
  }
)
</script>

<style scoped></style>
