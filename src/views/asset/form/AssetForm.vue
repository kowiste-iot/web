<template>
  <InputCard
    class="full-height m-0"
    :headerText="$t(edit ? 'asset.form.titleUpdate' : 'asset.form.titleCreate')"
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <Flex column>
      <label>{{ $t('asset.form.name') }} </label>
      <Input
        :placeholder="$t('asset.form.nameHolder')"
        type="text"
        :error="errors?.getError('name')"
        v-model="form.name"
      />
    </Flex>
    <Flex column>
      <label>{{ $t('asset.form.parent') }} </label>
      <MultiDropdown
        :options="availableParents"
        idField="id"
        labelField="name"
        :placeholder="$t('asset.form.parentHolder')"
        :error="errors?.getError('parent')"
        v-model="selectedParent"
      />
    </Flex>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { Asset, type IAsset } from '@/features/asset/domain/asset'
import { useBasePage } from '@/composable/useBasePage'
import { AssetService } from '@/features/asset/application/assetService'
import { AssetRepository } from '@/features/asset/repository/assetRepository'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import Flex from '@/components/layout/Flex.vue'

// other imports
// props
interface Props {
  data?: IAsset
  edit: boolean
}
const props = withDefaults(defineProps<Props>(), {
  edit: false,
  data: () => ({} as IAsset),
})
const emit = defineEmits<{
  close: []
}>()
// data
const form = reactive<IAsset>({
  ...props.data,
  name: props.data?.name ?? '',
  parent: props.data?.parent ?? undefined,
  description: props.data?.description ?? undefined,
})
const assetStore = useAssetStore()
const selectedParent = ref({} as IAsset)
const errors = ref<ValidationError<IAsset> | null>(new ValidationError())
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
    return assetStore.assets.filter((asset) => asset.id !== props.data.id)
  }
  return assetStore.assets
})

// methods
async function save() {
  if (props.edit) {
    errors.value = await assetService.updateAsset(form)
  } else {
    errors.value = await assetService.createAsset(form)
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
  assetStore.fetchAssets()
})
// watch
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
</script>

<style scoped></style>
