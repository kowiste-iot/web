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
    <InputCard class="h-100">
      <template #header>Select a Widget</template>
      hello
      <template #footer>
        <Button :color="EColor.Success">Save</Button>
        <Button :color="EColor.Secondary" outline @click="() => (show = false)"
          >Cancel</Button
        >
      </template>
    </InputCard>
  </SideCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'

// components import
import SideCard from '@/components/cards/SideCard.vue'
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props
// data
const show = ref(false)

// storage calls
useBreadCrumb().set('dashboards')

// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
