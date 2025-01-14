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
      <DropDown
        class="col-md-8"
        optionValue="name"
        optionLabel="name"
        :placeholder="$t('measure.form.parentHolder')"
        :options="assets"
        :error="errors['parent']"
        v-model="form.parent"
      >
        <template #option="{ data }">
          {{ data.name }}
        </template>
      </DropDown>
    </div>
    <template #footer>
      <Button
        :color="edit ? EColor.Warning : EColor.Success"
        @click="save()"
        >{{ $t(edit ? 'action.update' : 'action.save') }}</Button
      >
      <Button :color="EColor.Secondary" outline @click="close()">{{
        $t('action.cancel')
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
import DropDown from '@/components/form/DropDown.vue'

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

const errors = ref<ValidationError<IMeasure>>({})

// service
const { notificationService } = useBasePage()
const measureService = new MeasureService(
  new MeasureRepository(),
  notificationService
)
// storage calls
const assetStore = useAssetStore()
// computed
const assets = computed(() => {
  return assetStore.assets
})
// watchers
watch(
  () => form,
  () => {
    errors.value = Measure.validate(form)
  },
  {
    deep: true,
  }
)

// methods
function save() {
  if (props.edit) {
    measureService.updateMeasure(form)
  } else {
    measureService.createMeasure(form)
  }
  props.close()
}
// lifeCycle
onMounted(() => {
  useAssetStore().fetchAssets()
})
// watch
</script>

<style scoped></style>
