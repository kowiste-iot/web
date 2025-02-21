<template>
  <InputCard
    class="h-100"
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
          :error="errors['name']"
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
        :error="errors['parent']"
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
          :class="{ 'is-invalid': errors.description }"
        />
        <div v-if="errors.description" class="invalid-feedback d-block">
          {{ errors.description }}
        </div>
      </div>
    </div>

    <template #footer>
      <Button :color="edit ? EColor.Warning : EColor.Success" @click="save()">
        {{ $t(edit ? 'actionGUI.update' : 'actionGUI.save') }}
      </Button>
      <Button :color="EColor.Secondary" outline @click="close()">
        {{ $t('actionGUI.cancel') }}
      </Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type PropType, computed, reactive } from 'vue'
import { Device } from '@/features/device/domain/device'
import type { IDevice } from '@/features/device/domain/device'
import type { ValidationError } from '@/features/shared/domain/baseValidator'
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
  close: {
    type: Function,
    default: () => {},
  },
})

// form and validation state
const form = reactive<IDevice>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? '',
  description: props.data?.description ?? '',
})
const selectedParent = ref({} as IAsset)
const errors = ref<ValidationError<IDevice>>({})

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
  let ok = false
  if (props.edit) {
    ok = await deviceService.updateDevice(form)
  } else {
    ok = await deviceService.createDevice(form)
  }
  if (!ok) return
  props.close()
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
