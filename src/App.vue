<template>
  <div
    class="d-flex align-items-stretch position-relative h-100 w-100"
    :data-bs-theme="darkTheme ? 'dark' : 'light'"
  >
    <SideMenu />
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
import { computed } from 'vue'
// stores import
import { useAlert } from '@/stores/gui/alert'
import { useUser } from '@/stores/gui/user'
// components import
import Alert from '@/components/alert/Alert.vue'
import { RouterView } from 'vue-router'
import Header from '@/components/menu/Header.vue'
// model imports
import SideMenu from './components/menu/SideMenu.vue'
// other imports
// props
// data

// storage calls
const alertStore = useAlert()
const userStore = useUser()
// computed
const showAlert = computed(() => {
  return alertStore.have
})
const alertData = computed(() => {
  return alertStore.alert
})
const darkTheme = computed(() => {
  return userStore.darkTheme
})
// methods

// lifeCycle

// watch
</script>

<style scope></style>
