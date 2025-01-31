<template>
  <InputCard
    class="h-100"
    :headerText="$t('role.form.titleCreate')"
    :icon="EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('role.form.name') }} </label>
      <Input
        class="col-md-8"
        :placeholder="$t('role.form.nameHolder')"
        type="text"
        :error="errors['name']"
        v-model="form.name"
      />
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
import { Asset, type IAsset } from '@/features/asset/domain/asset'
import { useBasePage } from '@/composable/useBasePage'
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import type { IRole } from '@/features/role/domain/role'
import { useRoleStore } from '@/features/role/stores/useRoleStore'
import { RoleService } from '@/features/role/application/roleService'
import { RoleRepository } from '@/features/role/repository/roleRepository'
import InputText from '@/components/form/InputText.vue'
import Role from '../Role.vue'
import type { IResource } from '@/features/resource/domain/resource'
import { ResourceService } from '@/features/resource/application/resourceService'
import { ResourceRepository } from '@/features/resource/repository/resourceRepository'

// other imports
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
const form = reactive<IResource>({
  ...props.data,
  name: props.data?.name ?? '',
})
const errors = ref<ValidationError<IResource>>({})
//service
const { notificationService } = useBasePage()
const resourceService = new ResourceService(new ResourceRepository(), notificationService)
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
