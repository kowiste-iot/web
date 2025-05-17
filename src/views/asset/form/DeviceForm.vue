<template>
  <InputCard
    class="full-height"
    :headerText="
      $t(edit ? 'device.form.titleUpdate' : 'device.form.titleCreate')
    "
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('device.form.name') }}</label>
      <div class="col-md-8">
        <Input
          :placeholder="$t('device.form.nameHolder')"
          type="text"
          :error="errors?.getError('name')"
          v-model="form.name"
        />
      </div>
    </div>

    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('device.form.parent') }}</label>

      <MultiDropdown
        class="col-md-8"
        :options="assets"
        idField="id"
        labelField="name"
        :placeholder="$t('device.form.parentHolder')"
        :error="errors?.getError('parent')"
        v-model="selectedParent"
      />
    </div>

    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('device.form.description') }}</label>
      <div class="col-md-8">
        <Input
          type="textarea"
          :placeholder="$t('device.form.descriptionHolder')"
          v-model="form.description"
          :class="{ 'is-invalid': errors?.getError('description') }"
        />
        <div
          v-if="errors?.getError('description')"
          class="invalid-feedback d-block"
        >
          {{ errors.getError('description') }}
        </div>
      </div>
    </div>

    <template #footer>
      <Button :color="edit ? EColor.Warning : EColor.Success" @click="save()">
        {{ $t(edit ? 'actionGUI.update' : 'actionGUI.save') }}
      </Button>
      <Button :color="EColor.Secondary" outline @click="emit('close')">
        {{ $t('actionGUI.cancel') }}
      </Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type PropType, computed, reactive } from 'vue'
import { Device } from '@/features/device/domain/device'
import type { IDevice, IDevicePassword } from '@/features/device/domain/device'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import { DeviceService } from '@/features/device/application/deviceService'
import { DeviceRepository } from '@/features/device/repository/deviceRepository'
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import type { IAsset } from '@/features/asset/domain/asset'

const props = defineProps({
  data: {
    type: Object as PropType<IDevice>,
    default: {},
  },
  edit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  close: [deviceInfo?: IDevicePassword]
}>()
// form and validation state
const form = reactive<IDevice>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? '',
  description: props.data?.description ?? '',
})
const selectedParent = ref({} as IAsset)
const errors = ref<ValidationError<IDevice> | null>(new ValidationError())

// services
const notificationService = new NotificationService(useNotificationStore())
const deviceService = new DeviceService(
  new DeviceRepository(),
  notificationService
)

const assetStore = useAssetStore()
// computed
const assets = computed(() => {
  return assetStore.assets
})

// methods
async function save() {
  if (props.edit) {
    errors.value = await deviceService.updateDevice(form)
    if (errors.value?.hasErrors()) return
    emit('close')
    return
  }
  const result = await deviceService.createDevice(form)

  if (result.error && result.error.hasErrors()) return
  emit('close', result.data)
}
// watch
watch(
  () => form,
  () => {
    errors.value = Device.validate(form)
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
// lifecycle
onMounted(() => {
  if (props.edit && props.data.parent) {
    const parent = assetStore.getAssetById(props.data.parent)
    if (parent) {
      selectedParent.value = parent
    }
  }
  useAssetStore().fetchAssets()
})
</script>
