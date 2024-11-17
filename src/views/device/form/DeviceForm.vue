<template>
  <InputCard
    class="h-100"
    :headerText="
      $t(edit ? 'device.form.titleUpdate' : 'device.form.titleCreate')
    "
    :icon="edit ? EIcon.Edit : EIcon.Add"
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('device.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('device.form.nameHolder')"
        type="text"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('device.form.parent') }} </label>
      <DropDown
        class="col-md-8"
        optionValue="name"
        optionLabel="name"
        :placeholder="$t('device.form.parentHolder')"
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
import { ref,reactive, computed, onMounted, type PropType } from 'vue'

// stores import
import { useAsset } from '@/stores/asset/asset'
import { useDevice } from '@/stores/device/device'
// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'
import DropDown from '@/components/form/DropDown.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import type { IDevice } from '@/model/device/device'
import { FormDevice } from '@/model/device/form/formDevice'
// other imports
// props
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
    default: function () {},
  },
})
// data
let form = reactive(new FormDevice())
// storage calls
const assetStore = useAsset()
const deviceStore = useDevice()
// computed
const assets = computed(() => {
  return assetStore.assets
})
// methods
function save() {
  if (props.edit) {
    deviceStore.update(form)
  } else {
    deviceStore.create(form)
  }
  props.close()
}
// lifeCycle
onMounted(() => {
  if (props.data && props.edit) {
    form = new FormDevice(props.data)
    form.loadAsset(assets.value)
  }
})
// watch
</script>

<style scoped></style>
