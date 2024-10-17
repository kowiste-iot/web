<template>
  <InputCard
    class="h-100"
    :headerText="$t('dashboard.form.title')"
    :icon="EIcon.Add"
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('dashboard.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('dashboard.form.nameHolder')"
        type="text"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('dashboard.form.parent') }} </label>
      <DropDown
        class="col-md-8"
        optionValue="id"
        optionLabel="name"
        :placeholder="$t('dashboard.form.parentHolder')"
        :options="[
          {
            id: 2,
            name: 'Build 1',
          },
          {
            id: 3,
            name: 'General',
          },
        ]"
        v-model="form"
      >
        <template #option="{ data }">
          {{ data.name }}
        </template>
      </DropDown>
    </div>
    <template #footer>
      <Button :color="EColor.Success">Save</Button>
      <Button :color="EColor.Secondary" outline @click="close()">Cancel</Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'
import DropDown from '@/components/form/DropDown.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  close: {
    type: Function,
    default: function () {},
  },
})
// data
const form = ref()
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
