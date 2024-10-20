<template>
  <div class="h-100 w-100">
    <GridLayout
      :layout="widgets"
      :col-num="24"
      :row-height="30"
      :is-draggable="page.unlock"
      :is-resizable="page.unlock"
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
        :minW="6"
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
            v-if="page.unlock"
            class="position-absolute top-0 end-0"
            :data="page.properties"
            :onClick="(id:number)=>console.log('press',id)"
          />
          <BarWidget>
            <div class="d-flex px-1">
              <div class="flex-fill">Temperature in the room</div>
              <FIcon
                class="pt-1"
                :class="`text-${EColor.Danger}`"
                :icon="EIcon.Sad"
                role="button"
                style="height: 1rem"
                @click="() => (page.show = true)"
              />
            </div>
          </BarWidget>
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
      @click="() => (page.show = true)"
    />
    <FIcon
      class="mt-3"
      :class="`text-${EColor.Secondary}`"
      :icon="page.unlock ? EIcon.UnLock : EIcon.Lock"
      role="button"
      style="height: 1.5rem"
      @click="() => (page.unlock = !page.unlock)"
    />
  </div>

  <SideCard v-if="page.show" class="col-md-12">
    <WidgetForm :close="() => (page.show = false)" />
  </SideCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
// components import
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import WidgetForm from '@/views/dashboard/form/WidgetForm.vue'
import BarWidget from '@/views/dashboard/card/Bar.vue'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { DashboardPage } from '@/model/dashboard/page/pageDashboard'

// other imports
// props
const page = ref(new DashboardPage())
const widgets = ref([
  { x: 0, y: 0, w: 6, h: 3, i: '0' },
  { x: 2, y: 0, w: 22, h: 4, i: '1' },
  // Add more items as needed
])
//data
useBreadCrumb().set(page.value.title, page.value.path)
</script>

<style scoped>
.box {
  padding-bottom: 100%;
}
</style>
