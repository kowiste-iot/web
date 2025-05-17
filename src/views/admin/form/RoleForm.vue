<template>
  <InputCard
    class="full-height"
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
        :error="errors.getError('name')"
        v-model="form.name"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('role.form.description') }} </label>
      <InputText
        class="col-md-8"
        placeholder=""
        :rows="5"
        :error="errors.getError('description')"
        v-model="form.description"
      />
    </div>

    <template #footer>
      <Button :color="EColor.Success" @click="save()">{{
        $t('actionGUI.save')
      }}</Button>
      <Button :color="EColor.Secondary" outline @click="close()">{{
        $t('actionGUI.cancel')
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
import { ValidationError } from '@/features/shared/domain/baseValidator'
import type { IRole } from '@/features/role/domain/role'
import { RoleService } from '@/features/role/application/roleService'
import { RoleRepository } from '@/features/role/repository/roleRepository'
import InputText from '@/components/form/InputText.vue'
import Role from '../Role.vue'

// other imports
// props
const props = defineProps({
  data: {
    type: Object as PropType<IRole>,
    default: {},
  },
  close: {
    type: Function,
    default: function () {},
  },
})
// data
const form = reactive<IRole>({
  ...props.data,
  name: props.data?.name ?? '',
  description: props.data?.description ?? undefined,
})
const errors = ref<ValidationError<IRole>>(new ValidationError())
//service
const { notificationService } = useBasePage()
const roleService = new RoleService(new RoleRepository(), notificationService)
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
  const ok = await roleService.createRole(form)
  if (!ok) return
  props.close()
}
// lifeCycle
// watch
</script>

<style scoped></style>
