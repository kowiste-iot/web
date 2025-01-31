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
        <div class="border rounded h-100 position-relative bg-light">
          <PropertyDot
            v-if="page.unlock"
            class="position-absolute top-0 end-0"
            :data="page.properties"
            :onClick="(id:number)=>console.log('press',id)"
          />
          <BoolWidget
            v-if="item.type == EWidget.Boolean"
            :measure="false"
            :data="item.data"
          />
          <NumberWidget
            v-if="item.type == EWidget.Number"
            :measure="5"
            :data="item.data"
          />
          <LineWidget
            v-if="item.type == EWidget.Line"
            :measure="5"
            :data="item.data"
          />
          <BarWidget
            v-if="item.type == EWidget.Bar"
            :measure="5"
            :data="item.data"
          />
          <PieWidget
            v-if="item.type == EWidget.Pie"
            :measure="5"
            :data="item.data"
          />
          <TextWidget
            v-if="item.type == EWidget.Text"
            :measure="5"
            :data="item.data"
          />
        </div>
      </GridItem>
    </GridLayout>
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
import { ref, computed } from 'vue'

// components import
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import WidgetForm from '@/views/dashboard/form/WidgetForm.vue'
import BarWidget from '@/views/dashboard/card/Bar.vue'
import BoolWidget from '@/views/dashboard/card/Boolean.vue'
import NumberWidget from '@/views/dashboard/card/Number.vue'
import LineWidget from '@/views/dashboard/card/Line.vue'
import PieWidget from '@/views/dashboard/card/Pie.vue'
import TextWidget from '@/views/dashboard/card/Text.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { DashboardPage } from '@/features/dashboard/presentation/pages/pageDashboard'
import { EWidget } from '@/features/dashboard/domain/EWidget'
import { useBasePage } from '@/composable/useBasePage'
import { useWidgetStore } from '@/features/dashboard/stores/useWidgetStore'

// other imports
// props
const page = ref(new DashboardPage())

// service
useBasePage(page.value.title, page.value.path)

// computed
const widgets = computed(() => {
  return useWidgetStore().widgets
})
// methods
// lifeCycle
// watch
</script>

<style scoped>
.box {
  padding-bottom: 100%;
}
</style>
