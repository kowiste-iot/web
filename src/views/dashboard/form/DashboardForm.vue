<template>
  <InputCard
    class="h-100"
    :headerText="
      $t(edit ? 'dashboard.form.titleUpdate' : 'dashboard.form.titleCreate')
    "
    :icon="edit ? EIcon.Edit : EIcon.Add"
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('dashboard.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('dashboard.form.nameHolder')"
        type="text"
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
        v-if="!form.errors()"
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
import { ref, computed, onMounted, type PropType } from 'vue'

// stores import
import { useAsset } from '@/stores/asset/asset'
import { useDashboard } from '@/stores/dashboard/dashboard'

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'
import DropDown from '@/components/form/DropDown.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'

import type { IDashboard } from '@/model/dashboard/dashboard'
import { FormDashboard } from '@/model/dashboard/form/form'
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
const form = ref(new FormDashboard())
// storage calls
const assetStore = useAsset()
const dashboardStore = useDashboard()
// computed
const assets = computed(() => {
  return assetStore.assets
})
// methods
function save() {
  if (props.edit) {
    dashboardStore.update(form.value)
  } else {
    dashboardStore.create(form.value)
  }
  props.close()
}
// lifeCycle
onMounted(() => {
  if (props.data && props.edit) {
    form.value = new FormDashboard(props.data)
    form.value.loadAsset(assets.value)
  }
})
// watch
</script>

<style scoped></style>
