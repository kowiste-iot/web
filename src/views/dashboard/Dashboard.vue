<template>
  <div class="h-100 w-100">
    <GridLayout
      :layout="widgets"
      :col-num="24"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      vertical-compact
      :margin="[10, 10]"
      use-css-transforms
    >
      <GridItem 
        v-for="item in widgets"
        :x="item.x"
        :y="item.y"
        :w="item.width"
        :h="item.height"
        :i="item.id"
        :key="item.id"
        :minH="3"
        :minW="2"
        @resized="
          () => {
            console.log('save', item)
          }
        "
        @moved="
          () => {
            console.log('save', item)
          }
        "
      >
        <div class="bg-danger"></div>
      </GridItem>
    </GridLayout>
    <!-- <GridDrag :items="items" :num-columns="12" /> -->
  </div>
  <FIcon
    :class="`text-${EColor.Success}`"
    :icon="EIcon.Add"
    style="position: fixed; top: 4rem; right: 1rem; height: 1.5rem"
    role="button"
    @click="() => (show = true)"
  />
  <SideCard v-if="show" class="col-md-12">
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
//import GridDrag from '@/components/layout/GridDrag.vue'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props

const show = ref(false)
const widgets = ref([
  { id: 1, x: 23, y: 2, width: 20, height: 5 },
  // Add more items as needed
])
useBreadCrumb().set('dashboards')
</script>

<style scoped>
.box {
  padding-bottom: 100%;
}
</style>
