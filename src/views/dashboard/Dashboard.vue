<template>
  <div>dashboard</div>
  <FIcon
    :class="`text-${EColor.Success}`"
    :icon="EIcon.Add"
    style="position: fixed; top: 4rem; right: 1rem; height: 1.5rem"
    role="button"
    @click="() => (show = true)"
  />
  <SideCard v-if="show" class="col-12">
    <WidgetForm :close="() => (show = false)" />
  </SideCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
// components import
import SideCard from '@/components/cards/SideCard.vue'
import WidgetForm from '@/views/dashboard/form/WidgetForm.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props

const show = ref(false)

useBreadCrumb().set('dashboards')
</script>

<style scoped>
.box {
  padding-bottom: 100%;
}
</style>
