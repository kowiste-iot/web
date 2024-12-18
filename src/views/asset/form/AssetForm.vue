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
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('asset.form.parent') }} </label>
      <DropDown
        class="col-md-8"
        optionValue="name"
        optionLabel="name"
        :placeholder="$t('asset.form.parentHolder')"
        :options="assets"
        :onChange="() => form.change()"
        v-model="form.parentSelected"
      >
        <template #option="{ data }">
          {{ data.name }}
        </template>
      </DropDown>
    </div>
    <template #footer>
      <Button
        v-if="!form.hasErrors()"
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
import { ref, reactive, computed, onMounted, type PropType } from 'vue'

// stores import
import { useAsset } from '@/stores/asset/asset'

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'
import DropDown from '@/components/form/DropDown.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import type { IAsset } from '@/model/asset/asset'
import { FormAsset } from '@/model/asset/form/formAsset'
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
let form = reactive(new FormAsset())
// storage calls
const assetStore = useAsset()
// computed
const assets = computed(() => {
  return assetStore.assets
})
// methods
function save() {
  if (props.edit) {
    assetStore.update(form)
  } else {
    assetStore.create(form)
  }
  props.close()
}
// lifeCycle
onMounted(() => {
  if (props.data && props.edit) {
    form = new FormAsset(props.data)
    form.load(assets.value)
  }
})
// watch
</script>

<style scoped></style>
