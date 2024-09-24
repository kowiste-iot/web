``
<template>
  <div class="position-relative">
    <Button
      :color="EColor.Ligth"
      :icon="EIcon.Property"
      @click="toggleVisibility"
    />
    <div
      v-if="isVisible"
      class="position-absolute top-0 start-100 card"
      @mouseleave="toggleVisibility"
    >
      <div v-for="element in data" class="">
        <div
          class="btn d-flex"
          :class="isHover[element.id] ? 'bg-secondary' : 'btn-ligth'"
          @click="onClick(element.id)"
          @mouseover="isHover[element.id] = true"
          @mouseleave="isHover[element.id] = false"
        >
          <i :class="element.icon"></i>
          <div class="ms-4">{{ element.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
// components import
import Button from '@/components/buttons/Button.vue'

// model imports
import { EIcon } from '@/enums/EIcon'
import { EColor } from '@/enums/EColor'
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
// computed
// methods
function toggleVisibility() {
  isVisible.value = !isVisible.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
