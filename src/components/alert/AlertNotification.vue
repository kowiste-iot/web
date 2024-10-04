``
<template>
  <div class="position-relative">
    <div class="px-2" role="button" @click="toggleVisibility">
      <FIcon
        class="pe-3"
        :icon="EIcon.Alert"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
    <div
      v-if="isVisible"
      class="position-absolute top-100 end-50 card py-2"
      @mouseleave="toggleVisibility"
    >
      <div v-for="(element,index) in alerts" class="">
        <div
          class="btn d-flex"
          :class="isHover[index] ? 'bg-secondary' : 'btn-ligth'"
          @click="onClick(index)"
          @mouseover="isHover[index] = true"
          @mouseleave="isHover[index] = false"
        >
          <FIcon :icon="element.icon" />
          <div class="ms-4 w-auto">{{ element.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, computed } from 'vue'

// stores import
import { useAlert } from '@/stores/gui/alert'

// components import

// model imports
import { EIcon } from '@/enums/gui/EIcon'
import { EColor } from '@/enums/gui/EColor'
import { Property } from '@/model/property'

// other imports
// props
const props = defineProps({
  data: {
    type: Array<Property>,
    default: [],
  },
  onClick: {
    type: Function,
    default: function () {},
  },
})
// data
const isVisible = ref(false)
const isHover = ref({} as { [key: number]: boolean })
// storage calls
const alertStore = useAlert()

// computed
const alerts = computed(() => {
  return alertStore.alerts
})
// methods
function toggleVisibility() {
  console.log('sf');
  
  isVisible.value = !isVisible.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
