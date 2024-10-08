<template>
  <InputCard class="h-100 forms">
    <template #header
      >{{ page.title }}

      <Tabs :tabs="page.tabs" :change="(id:number)=>page.changeTab(id)">
        <template #default="{ data }"> {{ data.name }}</template>
      </Tabs>
    </template>
    <div class="h-100 w-100 container">
      <div v-if="page.selected == 1" class="row overflow-auto">
        <div v-for="widget in widgets" class="col-lg-3 col-md-4 col-xs-6">
          <div role="button" @click="selectWidget(widget)">
            <div
              class="border border-2 rounded box p-3 m-3 d-flex flex-column justify-content-center"
            >
              <FIcon
                class="mb-2 opacity-50"
                :class="`text-${EColor.Secondary}`"
                :icon="widget.icon"
                style="height: 5rem"
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
      <div v-else>
        <div v-if="selectedWidget.id == 0">Select a widget first</div>
        <div v-else>
          Selected widget: {{ selectedWidget.name }}

          <div class="form-group row justify-content-center">
            <label class="col-md-2 col-form-label"> Name </label>
            <Input
              class="col-md-8 col-form-label"
              placeholder="Your user name"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button v-if="page.selected > 1" :color="EColor.Success">Save</Button>
      <div v-else></div>
      <Button :color="EColor.Secondary" outline @click="close()">
        Cancel
      </Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import
// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Tabs from '@/components/tab/Tabs.vue'
import Input from '@/components/form/Input.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { WidgetFormPage } from '@/model/dashboard/page/pageWidgetForm'
import { type IWidget } from '@/model/widget/widget'
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
const page = ref(new WidgetFormPage())
let selectedWidget = ref({ id: 0 } as IWidget)
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
] as IWidget[]
// storage calls
// computed
// methods
function selectWidget(data: IWidget) {
  page.value.changeTab(2)
  selectedWidget.value = data
}
// lifeCycle
// watch
</script>

<style scoped></style>
