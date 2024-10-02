<template>
  <div
    class="d-flex align-items-stretch position-relative h-100"
    :data-bs-theme="'light'"
  >
    <SideMenu />
    <Alert
      v-if="false"
      class="position-absolute start-50 translate-middle-x"
      :icon="EIcon.Success"
      :color="EColor.Success"
      style="width: 50%"
      >i'm alert
    </Alert>
    <div class="flex-fill  overflow-scroll">
      <RouterView  class="container-md"/>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import

// components import
import Alert from '@/components/alert/Alert.vue'
import { RouterView } from 'vue-router'

// model imports
import { EIcon } from '@/enums/gui/EIcon'
import { EColor } from '@/enums/gui/EColor'
import SideMenu from './components/menu/SideMenu.vue'
// other imports
// props
// data

// storage calls

// computed
// methods

// lifeCycle

// watch
</script>

<style scope>

</style>
