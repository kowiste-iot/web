``
<template>
  <div class="position-relative over">
    <div class="px-2" role="button" @click="toggleVisibility">
      <FIcon
        class="pe-3"
        :icon="EIcon.Alert"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
    <div
      v-if="isVisible"
      class="position-absolute top-100 end-50 border rounded bg-white py-2 px-3"
      style="min-width: 10rem; width: 20rem"
      @mouseleave="toggleVisibility"
    >
      <div v-if="alerts.length < 1">No Alerts</div>
      <div v-else>
        <div v-for="(element, index) in alerts" class="">
          <div
            class="btn d-flex"
            :class="isHover[index] ? 'bg-secondary' : 'btn-ligth'"
            @click="onClick(index)"
            @mouseover="isHover[index] = true"
            @mouseleave="isHover[index] = false"
          >
            <FIcon class="pt-1" :icon="element.icon" />
            <div class="ms-4 flex-fill">{{ element.text }}</div>
            <FIcon class="pt-1 text-danger" :icon="EIcon.Close" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, computed, type Prop } from 'vue'

// stores import
import { useAlert } from '@/stores/gui/alert'

// components import

// model imports
import { EIcon } from '@/features/shared/enum/EIcon'
import { Property, type IProperty } from '@/model/property'

// other imports
// props
interface Props {
  data?: Property[]
  onClick?: Function
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  onClick: function () {},
})
// data
const isVisible = ref(false)
const isHover = ref({} as Record<string, boolean>)
// storage calls
const alertStore = useAlert()

// computed
const alerts = computed(() => {
  return alertStore.alerts
})
// methods
function toggleVisibility() {
  console.log('sf')

  isVisible.value = !isVisible.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
