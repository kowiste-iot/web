<template>
  <TabletCard class="mt-5">
    <DataTable :value="assets">
      <Column
        :class="page.table.name.location"
        :field="page.table.name.data"
        sortable
      >
        <template #header>
          <span class="container-fluid">
            {{ page.table.name.title }}
          </span>
        </template>
      </Column>
      <Column
        :class="page.table.email.location"
        :field="page.table.email.data"
        sortable
      >
        <template #header>
          <span class="container-fluid">
            {{ page.table.email.title }}
          </span>
        </template>
      </Column>

      <Column>
        <template #body="{ data }">
          <PropertyDot
            :data="page.properties"
            @click="(prop:Property)=>propertySelected(prop,data)"
          />
        </template>
      </Column>
    </DataTable>
  </TabletCard>
  <div
    class="d-flex flex-column"
    style="position: fixed; top: 4rem; right: 1rem"
  >
    <FIcon
      id="admin-user-add"
      :class="`text-${EColor.Success}`"
      :icon="EIcon.Add"
      role="button"
      style="height: 1.5rem"
      @click="() => (page.showForm = true)"
    />
  </div>
  <Modal v-if="page.showForm" @cancel="closeForm">
    <SideCard class="col-md-6">
      <UserForm
        :data="page.selected"
        :edit="page.editForm"
        @close="closeForm"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('actionGUI.delete')"
    @action="deleteUser"
    @cancel="
      () => {
        page.showModal = false
      }
    "
  >
    <div class="text-center">{{ $t('asset.delete') }}</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted, reactive, watch } from 'vue'
// stores import
import { useBasePage } from '@/composable/useBasePage'
import { useUserStore } from '@/features/user/stores/useUserStore'
import { useSessionStore } from '@/features/session/store/useSessionStore'

// components import
// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import type { Property } from '@/features/shared/domain/property'
import Modal from '@/components/layout/Modal.vue'
import { UserPage } from '@/features/user/presentation/pages/pageUser'
import { UserService } from '@/features/user/application/userService'
import { UserRepository } from '@/features/user/repository/userRepository'
import type { IUser } from '@/features/user/domain/user'
import UserForm from './form/UserForm.vue'
// other imports
// props

// data
const page = reactive(new UserPage())

//service
const { notificationService } = useBasePage(page.title)
const userService = new UserService(new UserRepository(), notificationService)
const sessionStore = useSessionStore()
const userStore = useUserStore()

// computed
const assets = computed(() => {
  return userStore.users
})
const branch = computed(() => {
  return sessionStore.getCurrentBranch
})
// methods
function propertySelected(prop: Property, data: IUser) {
  page.selected = data
  switch (prop.id) {
    case 1:
      page.showForm = true
      page.editForm = true
      break
    case 2:
      page.showModal = true
      break
  }
}
async function deleteUser() {
  await userService.deleteUser(page.selected!.id!)
  page.selected = undefined
  page.showModal = false
  refreshData()
}
function closeForm() {
  refreshData()
  page.reset()
}
async function refreshData() {
  await userStore.fetchUsers()
}
// lifeCycle
onMounted(() => {
  refreshData()
})
// watch
watch(
  () => branch.value,
  async () => {
    await refreshData()
  }
)
</script>

<style scoped></style>
