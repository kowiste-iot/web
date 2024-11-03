<template>
  <div
    class="d-flex align-items-stretch position-relative h-100 w-100"
  >
    <SideMenu  />
    <Alert
      v-if="showAlert"
      class="position-absolute start-50 translate-middle-x col-md-6"
      :icon="alertData.icon"
      :color="alertData.color"
      style="top: -10rem"
      >{{ alertData.text }}
    </Alert>
    <div class="d-flex flex-column w-100">
      <Header />
      <div class="flex-fill overflow-scroll">
        <div class="container-md pt-4 h-100">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted } from 'vue'
// stores import
import { useAlert } from '@/stores/gui/alert'
import { useUser } from '@/stores/gui/user'
import { useDashboard } from '@/stores/dashboard/dashboard'
import { useAsset } from '@/stores/asset/asset'
// components import
import Alert from '@/components/alert/Alert.vue'
import { RouterView } from 'vue-router'
import Header from '@/components/menu/Header.vue'
// model imports
import SideMenu from './components/menu/SideMenu.vue'
import { FormDashboard } from './model/dashboard/form/form'
import type { IDashboard } from './model/dashboard/dashboard'
import type { FormAsset } from './model/asset/form/form'
// other imports
// props
// data

// storage calls
const alertStore = useAlert()
const userStore = useUser()
const dashboardStore = useDashboard()
const assetStore = useAsset()
// computed
const showAlert = computed(() => {
  return alertStore.have
})
const alertData = computed(() => {
  return alertStore.alert
})

// methods

// lifeCycle
//TODO:delete later
onMounted(() => {
  const d = new FormDashboard({
    name: 'mi dashboard',
    parent: 'non',
  } as IDashboard)
  dashboardStore.create(d)
  assetStore.create({
    id: 'kfnwef34kf34',
    name: 'Barcelona',
    parent: '-',
  } as FormAsset)
  assetStore.create({
    id: 'qf343469',
    name: 'Office Barcelona',
    parent: 'kfnwef34kf34',
  } as FormAsset)
  assetStore.create({
    id: 'kw45tij5gn',
    name: 'Warehouse Barcelona',
    parent: 'kfnwef34kf34',
  } as FormAsset)
})
// watch
</script>

<style scope></style>
