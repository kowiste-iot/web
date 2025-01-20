<template>
  <div v-if="isTenantRoute" class="vh-100 w-100">
    <AlertContainer />
    <RouterView />
  </div>

  <div v-else class="d-flex align-items-stretch h-100 w-100 position-relative p-0 m-0">
    <SideMenu />
    <AlertContainer />
    <div class="d-flex flex-column w-100 m-0 p-0">
      <Header />
      <div class="flex-fill h-100 m-0 p-0">
        <div class="container-md h-100 pt-4 pb-0 mb-0">
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
// components import
import { RouterView, useRoute } from 'vue-router'
import Header from '@/components/menu/Header.vue'
import SideMenu from './features/menu/component/SideMenu.vue'
import AlertContainer from './features/notification/component/AlertContainer.vue'

// model imports

// props
// data

// storage calls
const route = useRoute()
const isTenantRoute = computed(() => route.name === 'tenant')

// computed

// methods

// lifeCycle
onMounted(() => {})
// watch
</script>

<style scope></style>
