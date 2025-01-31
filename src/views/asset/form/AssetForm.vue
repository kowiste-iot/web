<template>
  <InputCard
    class="h-100"
    :headerText="$t(edit ? 'asset.form.titleUpdate' : 'asset.form.titleCreate')"
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('asset.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('asset.form.nameHolder')"
        type="text"
        :error="errors['name']"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('asset.form.parent') }} </label>
      <div class="col-md-8">
        <DropDown
          optionValue="name"
          optionLabel="name"
          :placeholder="$t('asset.form.parentHolder')"
          :options="availableParents"
          :error="errors['parent']"
          v-model="selectedParent"
        >
          <template #option="{ data }">
            {{ data.name }}
          </template>
        </DropDown>
      </div>
    </div>
    <template #footer>
      <Button :color="edit ? EColor.Warning : EColor.Success" @click="save()">{{
        $t(edit ? 'action.update' : 'action.save')
      }}</Button>
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

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { Asset, type IAsset } from '@/features/asset/domain/asset'
import { useBasePage } from '@/composable/useBasePage'
import { AssetService } from '@/features/asset/application/assetService'
import { AssetRepository } from '@/features/asset/repository/assetRepository'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
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
const form = reactive<IAsset>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? undefined,
  description: props.data?.description ?? undefined,
})
const assetStore = useAssetStore()
const selectedParent = ref({} as IAsset)
const errors = ref<ValidationError<IAsset>>({})
//service
const { notificationService } = useBasePage()
const assetService = new AssetService(
  new AssetRepository(),
  notificationService
)
// computed
// Add a new computed property to filter out the current asset
const availableParents = computed(() => {
  if (props.edit) {
    // Filter out the current asset when editing
    return assetStore.assets.filter(asset => asset.id !== props.data.id)
  }
  return assetStore.assets
})
// watchers for real-time validation
watch(
  () => form,
  () => {
    errors.value = Asset.validate(form)
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
// methods
async function save() {
  if (props.edit) {
    await assetService.updateAsset(form)
  } else {
    await assetService.createAsset(form)
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
  assetStore.fetchAssets()
})
// watch
</script>

<style scoped></style>
