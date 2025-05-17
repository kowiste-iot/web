<template>
  <InputCard
    class="full-height"
    :headerText="
      $t(edit ? 'dashboard.form.titleUpdate' : 'dashboard.form.titleCreate')
    "
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('dashboard.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('dashboard.form.nameHolder')"
        type="text"
        :error="errors?.getError('name')"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('dashboard.form.parent') }} </label>
      <MultiDropdown
        class="col-md-8"
        :options="assets"
        idField="id"
        labelField="name"
        :placeholder="$t('dashboard.form.parentHolder')"
        :error="errors?.getError('parent')"
        v-model="selectedParent"
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

// stores import

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import {
  Dashboard,
  type IDashboard,
} from '@/features/dashboard/domain/dashboard'
import { useBasePage } from '@/composable/useBasePage'
import { DashboardService } from '@/features/dashboard/application/dashboardService'
import { DashboardRepository } from '@/features/dashboard/repository/dashboardRepository'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import type { IAsset } from '@/features/asset/domain/asset'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import { useDashboardStore } from '@/features/dashboard/stores/useDashboardStore'

// other imports
// props
const props = defineProps({
  data: {
    type: Object as PropType<IDashboard>,
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
const form = reactive<IDashboard>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? '',
  description: props.data?.description ?? '',
})
const errors = ref<ValidationError<IDashboard> | null>(new ValidationError())
const selectedParent = ref({} as IAsset)

// service
const { notificationService } = useBasePage()
const dashboardService = new DashboardService(
  new DashboardRepository(),
  notificationService
)
const dashboardStore = useDashboardStore()

// computed
const assets = computed(() => {
  return useAssetStore().assets
})

// methods
async function save() {
  if (props.edit) {
    errors.value = await dashboardService.updateDashboard(form)
  } else {
    errors.value = await dashboardService.createDashboard(form)
  }
  if (errors.value?.hasErrors()) return
  emit('close')
}
// lifeCycle
onMounted(() => {
  if (props.data && props.edit) {
    useAssetStore().fetchAssets()
  }
})
// watchers
watch(
  () => form,
  () => {
    errors.value = Dashboard.validate(form)
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
