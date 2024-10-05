<template>
  <InputCard class="h-100">
    <template #header
      >Select a Widget

      <Tabs
        :tabs="[
          new Tab(1, 'test', true),
          new Tab(2, 'other', false),
          new Tab(3, 'more', false),
        ]"
        :change="() => {}"
      >
        <template #default="{ data }"> {{ data.name }}</template>
      </Tabs>
    </template>
    <div class="h-100 w-100 container">
      <div class="row overflow-auto">
        <div v-for="widget in widgets" class="col-lg-3 col-md-4 col-xs-6">
          <div class="">
            <div
              class="border border-2 rounded box p-3 m-3 d-flex flex-column justify-content-center"
            >
              <FIcon
                class="mb-2 opacity-50"
                :class="`text-${EColor.Secondary}`"
                :icon="widget.icon"
                style="height: 5rem"
                role="button"
              />
              <div class="">
                <div class="text-start fw-bold" style="font-size: 1.2rem">
                  {{ widget.name }}
                </div>
                <div class="text-center">{{ widget.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button :color="EColor.Success">Save</Button>
      <Button :color="EColor.Secondary" outline @click="close()"> Cancel </Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Tabs from '@/components/tab/Tabs.vue'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { Tab } from '@/model/gui/tab'
// other imports
// props
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  close: {
    type: Function,
    default: function () {},
  },
})
// data
const widgets = [
  {
    id: 1,
    name: 'Boolean',
    description: 'bool widget, true / false',
    icon: EIcon.WidgetBool,
  },
  {
    id: 2,
    name: 'Number',
    description: 'number widget, max 2 decimal',
    icon: EIcon.WidgetNumeric,
  },
  {
    id: 3,
    name: 'Gauge',
    description: 'gauge widget',
    icon: EIcon.WidgetGauge,
  },
  {
    id: 4,
    name: 'Line Graph',
    description: 'line graph widget',
    icon: EIcon.WidgetLineGraph,
  },
  {
    id: 5,
    name: 'Bar Graph',
    description: ' bar graph widget',
    icon: EIcon.WidgetBarGraph,
  },
  {
    id: 6,
    name: 'Pie Chart',
    description: 'pie chart widget',
    icon: EIcon.WidgetPieChart,
  },
  {
    id: 7,
    name: 'Text',
    description: 'text widget',
    icon: EIcon.WidgetText,
  },
  {
    id: 8,
    name: 'Table',
    description: 'table widget',
    icon: EIcon.WidgetTable,
  },
]
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
