<template>
  <div @click="sh">device</div>
  {{ showModal }}
  <ConfirmCard v-if="showModal" :action="EActionGUI.Success" :onCancel="cancel">
    <div class="text-center">Confirm the change</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'

// components import
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
// model imports
import { EActionGUI } from '@/enums/gui/EActionGUI'
// other imports
// props
// data
const showModal = ref(false)
// storage calls
useBreadCrumb().set('devices')

// computed
// methods
function sh() {
  showModal.value = true
}
function cancel() {
  showModal.value = false
}
// lifeCycle
// watch
</script>

<style scoped></style>
