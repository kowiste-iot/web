<template>
  <div class="h-100 w-100">
    <GridLayout
      :layout="widgets"
      :col-num="24"
      :row-height="30"
      :is-draggable="unlock"
      :is-resizable="unlock"
      vertical-compact
      :margin="[5, 5]"
      use-css-transforms
    >
      <GridItem
        v-for="item in widgets"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
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
        <div class="border rounded h-100 position-relative bg-white">
          <PropertyDot
            v-if="unlock"
            class="position-absolute top-0 end-0"
            :data="page.widgetProp"
            :onClick="(id:number)=>console.log('press',id)"
          />
        </div>
      </GridItem>
    </GridLayout>
    <!-- <GridDrag :items="items" :num-columns="12" /> -->
  </div>
  <div
    class="d-flex flex-column"
    style="position: fixed; top: 4rem; right: 1rem"
  >
    <FIcon
      :class="`text-${EColor.Success}`"
      :icon="EIcon.Add"
      role="button"
      style="height: 1.5rem"
      @click="() => (show = true)"
    />
    <FIcon
      class="mt-3"
      :class="`text-${EColor.Secondary}`"
      :icon="unlock ? EIcon.UnLock : EIcon.Lock"
      role="button"
      style="height: 1.5rem"
      @click="() => (unlock = !unlock)"
    />
  </div>

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
import PropertyDot from '@/components/property/Property.vue'

//import GridDrag from '@/components/layout/GridDrag.vue'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { DashboardPage } from '@/model/dashboard/page/pageDashboard'

// other imports
// props
const page = ref(new DashboardPage())
const show = ref(false)
const unlock = ref(false)
const widgets = ref([
  { x: 0, y: 0, w: 2, h: 2, i: '0' },
  { x: 2, y: 0, w: 22, h: 4, i: '1' },
  // Add more items as needed
])
useBreadCrumb().set(page.value.title, page.value.path)
</script>

<style scoped>
.box {
  padding-bottom: 100%;
}
</style>
