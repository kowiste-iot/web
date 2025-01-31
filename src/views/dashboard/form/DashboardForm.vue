<template>
  <InputCard
    class="h-100"
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
        :error="errors['name']"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('dashboard.form.parent') }} </label>
      <DropDown
        class="col-md-8"
        optionValue="name"
        optionLabel="name"
        :placeholder="$t('dashboard.form.parentHolder')"
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

// stores import

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'
import DropDown from '@/components/form/DropDown.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import type { IDashboard } from '@/features/dashboard/domain/dashboard'
import { useBasePage } from '@/composable/useBasePage'
import { DashboardService } from '@/features/dashboard/application/dashboardService'
import { DashboardRepository } from '@/features/dashboard/repository/dashboardRepository'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import Dashboard from '../Dashboard.vue'

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
  close: {
    type: Function,
    default: function () {},
  },
})
// data
const form = reactive<IDashboard>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? '',
  description: props.data?.description ?? '',
})
const errors = ref<ValidationError<IDashboard>>({})

// service
const { notificationService } = useBasePage()
const dashboardService = new DashboardService(
  new DashboardRepository(),
  notificationService
)
// computed
const assets = computed(() => {
  return useAssetStore().assets
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
// methods
function save() {
  if (props.edit) {
    dashboardService.updateDashboard(form)
  } else {
    dashboardService.createDashboard(form)
  }
  props.close()
}
// lifeCycle
onMounted(() => {
  if (props.data && props.edit) {
    useAssetStore().fetchAssets()
  }
})
// watch
</script>

<style scoped></style>
