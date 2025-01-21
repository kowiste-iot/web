<template>
  <InputCard
    class="h-100"
    :headerText="$t('resource.form.titleUpdate')"
    :icon="EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('role.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('resource.form.nameHolder')"
        type="text"
        disabled
        :error="errors['name']"
        v-model="form.displayName"
      />
    </div>
    <div v-for="(roleArray, roleName) in form.roles" :key="roleName">
      <div class="row mb-3">
        <label class="col-md-2 pt-2">{{ $t('resource.form.role') }} </label>
        <Input
          class="col-md-4"
          type="text"
          :placeholder="String(roleName)"
          disabled
          :error="errors['name']"
        />
        <MultiDropdown
          class="col-md-5"
          :options="roleArray"
          :chipColor="EColor.Color1"
          v-model="selectedIds"
        />
      </div>
      <!-- <DropDown
        class="col-md-8"
        optionValue="name"
        optionLabel="name"
        :placeholder="$t('asset.form.parentHolder')"
        :options="availableRoles"
        :error="errors['roles']"
        v-model="selectedParent"
      >
        <template #option="{ data }">
          {{ data.name }}
        </template>
      </DropDown> -->
    </div>

    <template #footer>
      <Button :color="EColor.Success" @click="save()">{{
        $t('action.save')
      }}</Button>
      <Button :color="EColor.Secondary" outline @click="close()">{{
        $t('action.cancel')
      }}</Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { ref, reactive, type PropType, watch } from 'vue'

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { useBasePage } from '@/composable/useBasePage'
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import Role from '../Role.vue'
import type { IResource } from '@/features/resource/domain/resource'
import { ResourceService } from '@/features/resource/application/resourceService'
import { ResourceRepository } from '@/features/resource/repository/resourceRepository'
import MultiDropdown from '@/components/form/MultiDropdown.vue'

// other imports




const fruits = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' }
]
const selectedIds = ref<number[]>([])
// props
const props = defineProps({
  data: {
    type: Object as PropType<IResource>,
    default: {},
  },
  close: {
    type: Function,
    default: function () {},
  },
})
// data
const selectedItems = ref<string[]>([])

const form = reactive<IResource>({
  ...props.data,
  name: props.data?.name ?? '',
})
const errors = ref<ValidationError<IResource>>({})
//service
const { notificationService } = useBasePage()
const resourceService = new ResourceService(
  new ResourceRepository(),
  notificationService
)
// computed

// watchers for real-time validation
watch(
  () => form,
  () => {
    errors.value = Role.validate(form)
  },
  {
    deep: true,
  }
)

// methods
async function save() {
  await resourceService.createResource(form)
  props.close()
}
// lifeCycle
// watch
</script>

<style scoped></style>
