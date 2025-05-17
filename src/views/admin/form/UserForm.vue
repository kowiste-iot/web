<template>
  <InputCard
    class="full-height"
    :headerText="$t(edit ? 'user.form.titleUpdate' : 'user.form.titleCreate')"
    :icon="edit ? EIcon.Edit : EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('user.form.firstName') }} </label>
      <Input
        id="admin-user-form-name"
        class="col-md-8"
        :placeholder="$t('user.form.firstNameHolder')"
        type="text"
        :error="errors?.getError('firstName')"
        v-model="form.firstName"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('user.form.lastName') }} </label>
      <Input
        id="admin-user-form-lastname"
        class="col-md-8"
        :placeholder="$t('user.form.lastNameHolder')"
        type="text"
        :error="errors?.getError('lastName')"
        v-model="form.lastName"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('user.form.email') }} </label>
      <Input
        id="admin-user-form-email"
        class="col-md-8"
        :placeholder="$t('user.form.emailHolder')"
        type="email"
        :disabled="props.edit"
        :error="errors?.getError('email')"
        v-model="form.email"
      />
    </div>
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('user.form.email') }} </label>
      <MultiDropdown
        class="col-md-8"
        :options="roles"
        idField="id"
        labelField="name"
        multiple
        :chipColor="EColor.Color1"
        v-model="selectedRoles"
      />
    </div>
    <template #footer>
      <Button
        id="admin-user-form-save"
        :color="edit ? EColor.Warning : EColor.Success"
        @click="save()"
        >{{ $t(edit ? 'actionGUI.update' : 'actionGUI.save') }}</Button
      >
      <Button :color="EColor.Secondary" outline @click="emit('close')">{{
        $t('actionGUI.cancel')
      }}</Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { ref, reactive, onMounted, type PropType, watch, computed } from 'vue'

// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { useBasePage } from '@/composable/useBasePage'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import { User, type IUser } from '@/features/user/domain/user'
import { UserService } from '@/features/user/application/userService'
import { UserRepository } from '@/features/user/repository/userRepository'
import { useRoleStore } from '@/features/role/stores/useRoleStore'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import { type IRole } from '@/features/role/domain/role'

// other imports
// props
const props = defineProps({
  data: {
    type: Object as PropType<IUser>,
    default: {},
  },
  edit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  close: []
}>()
// data
const form = reactive<IUser>({
  ...props.data,
  firstName: props.data?.firstName ?? '',
  lastName: props.data?.lastName ?? undefined,
  email: props.data?.email ?? undefined,
})
const selectedRoles = ref(new Array<IRole>())
const roleStore = useRoleStore()
const errors = ref<ValidationError<IUser> | null>(new ValidationError())
//service
const { notificationService } = useBasePage()
const userService = new UserService(new UserRepository(), notificationService)
// computed
const roles = computed(() => {
  return roleStore.roles
})

// methods
async function save() {
  if (props.edit) {
    errors.value = await userService.updateUser(form)
  } else {
    errors.value = await userService.createUser(form)
  }
  if (errors.value?.hasErrors()) return
  emit('close')
}
async function refreshData() {
  await roleStore.fetchRoles()
}
// lifeCycle
onMounted(() => {
  refreshData()
})
// watch
watch(
  () => selectedRoles.value,
  () => {
    form.roles = []
    selectedRoles.value.forEach((role) => {
      form.roles.push(role.name)
    })
  },
  {
    deep: true,
  }
)
watch(
  () => form,
  () => {
    errors.value = User.validate(form)
  },
  {
    deep: true,
  }
)
watch(
  () => roles.value,
  () => {
    selectedRoles.value = []
    form.roles?.forEach((roleName: string) => {
      const found = roles.value.find((role) => role.name == roleName)
      if (found != undefined) {
        selectedRoles.value.push(found)
      }
    })
  },
  { immediate: true }
)
</script>

<style scoped></style>
