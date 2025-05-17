<template>
  <InputCard
    class="full-height"
    :headerText="$t('resource.form.titleUpdate')"
    :icon="EIcon.Add"
    showHeader
    showFooter
  >
    <div class="row mb-3">
      <label class="col-md-4 pt-2">{{ $t('role.form.name') }} </label>
      <Input
        class="col-md-5"
        :placeholder="$t('resource.form.nameHolder')"
        type="text"
        disabled
        :error="errors.getError('name')"
        v-model="form.displayName"
      />
      <div class="col-md-2"></div>
    </div>

    <div class="row mt-5">
      <div class="col-md-2">
        <label class="pt-2">{{ $t('resource.form.role') }} </label>
      </div>
      <div class="col-md-9">
        <div v-for="(scopes, roleName) in form.roles" :key="roleName">
          <div class="row mb-3">
            <Input
              class="col-md-3"
              type="text"
              :placeholder="String(roleName)"
              disabled
              :error="errors.getError('name')"
            />
            <MultiDropdown
              class="col-md-6 mt-1"
              :options="scopes"
              idField="id"
              labelField="name"
              disabled
              multiple
              :chipColor="EColor.Color1"
              v-model="form.roles[roleName]"
            />
            <div class="col-md-2">
              <FIcon
                :class="`text-${EColor.Danger}`"
                :icon="EIcon.Sub"
                role="button"
                style="height: 1.5rem"
                @click="removeRole(String(roleName))"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <MultiDropdown
            class="col-md-3"
            :options="filteredRoles"
            idField="id"
            labelField="name"
            :chipColor="EColor.Color1"
            v-model="newLine.role"
          />
          <MultiDropdown
            class="col-md-6"
            :options="scopes"
            idField="id"
            labelField="name"
            multiple
            :chipColor="EColor.Color1"
            v-model="newLine.scopes"
          />
          <div class="col-md-2">
            <FIcon
              :class="`text-${EColor.Success}`"
              :icon="EIcon.Add"
              role="button"
              style="height: 1.5rem"
              @click="addLine"
            />
          </div>
        </div>
      </div>
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
import { ref, reactive, type PropType, watch, onMounted, computed } from 'vue'
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Input from '@/components/form/Input.vue'
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { useBasePage } from '@/composable/useBasePage'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import type { IResource } from '@/features/resource/domain/resource'
import { ResourceService } from '@/features/resource/application/resourceService'
import { ResourceRepository } from '@/features/resource/repository/resourceRepository'
import MultiDropdown from '@/components/form/MultiDropdown.vue'
import { useRoleStore } from '@/features/role/stores/useRoleStore'
import { useScopeStore } from '@/features/scope/stores/useScopeStore'
import type { IScope } from '@/features/scope/domain/scope'
import type { IRole } from '@/features/role/domain/role'

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

interface NewLine {
  role: IRole
  scopes: Array<IScope>
}

const roleStore = useRoleStore()
const scopeStore = useScopeStore()
const newLine = reactive<NewLine>({
  role: {} as IRole,
  scopes: [],
})
const form = reactive<IResource>({
  ...props.data,
  name: props.data?.name ?? '',
})
const errors = ref<ValidationError<IResource>>(new ValidationError())
// computed
const scopes = computed(() => {
  return scopeStore.scopes
})
const filteredRoles = computed(() => {
  return roleStore.getRolesNonAdmin.filter(
    (role) => !Object.keys(form.roles || {}).includes(role.name)
  )
})
// service
const { notificationService } = useBasePage()
const resourceService = new ResourceService(
  new ResourceRepository(),
  notificationService
)

// method
function removeRole(roleName: string) {
  delete form.roles[roleName]
}

function addLine() {
  if (newLine.role && newLine.scopes.length > 0) {
    form.roles[newLine.role.name] = newLine.scopes
    newLine.role = {} as IRole
    newLine.scopes = []
  }
}
async function refreshData() {
  await roleStore.fetchRoles()
  await scopeStore.fetchScopes()
}

async function save() {
  const ok = await resourceService.updateResource(form)
  if (!ok) return
  props.close()
}

// hooks
onMounted(() => {
  refreshData()
})

//watchers
watch(
  () => form,
  () => {
    //errors.value = Role.validate(form)
  },
  {
    deep: true,
  }
)
</script>

<style scoped></style>
