<template>
  <InputCard class="h-100 forms" showHeader showFooter>
    <template #header
      >{{ page.title }}

      <Tabs :tabs="page.tabs" :onChange="(id:number)=>page.changeTab(id)">
        <template #default="{ data }"> {{ data.name }}</template>
      </Tabs>
    </template>
    <div class="h-100 w-100 container">
      <div v-if="page.selectedTab == 1" class="row overflow-auto">
        <div v-for="widget in page.widgets" class="col-lg-3 col-md-4 col-xs-6">
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
        <div v-if="page.selectedWidget.id == EWidget.None">
          Select a widget first
        </div>
        <div v-else>
          <div class="row pb-2">
            {{ $t('widget.form.selected') }} {{ page.selectedWidget.name }}
          </div>
          <BoolForm
            v-if="page.selectedWidget.id == EWidget.Boolean"
            v-model="form"
          />
          <NumberForm
            v-if="page.selectedWidget.id == EWidget.Number"
            v-model="form"
          />
          <GaugeForm
            v-if="page.selectedWidget.id == EWidget.Gauge"
            v-model="form"
          />
          <LineForm
            v-if="page.selectedWidget.id == EWidget.Line"
            v-model="form"
          />
          <BarForm
            v-if="page.selectedWidget.id == EWidget.Bar"
            v-model="form"
          />
          <PieForm
            v-if="page.selectedWidget.id == EWidget.Pie"
            v-model="form"
          />
          <TextForm
            v-if="page.selectedWidget.id == EWidget.Text"
            v-model="form"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        v-if="page.selectedTab > 1"
        :color="EColor.Success"
        @click="save"
        >{{ $t('action.save') }}</Button
      >
      <div v-else></div>
      <Button :color="EColor.Secondary" outline @click="close()">
        {{ $t('action.cancel') }}
      </Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { reactive, ref } from 'vue'
// stores import
import { useRoute } from 'vue-router'
// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Tabs from '@/components/tab/Tabs.vue'
import BoolForm from '@/views/dashboard/card/BoolForm.vue'
import NumberForm from '@/views/dashboard/card/NumberForm.vue'
import GaugeForm from '@/views/dashboard/card/GaugeForm.vue'
import LineForm from '@/views/dashboard/card/LineForm.vue'
import BarForm from '@/views/dashboard/card/BarForm.vue'
import PieForm from '@/views/dashboard/card/PieForm.vue'
import TextForm from '@/views/dashboard/card/TextForm.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EWidget } from '@/features/dashboard/domain/EWidget'
// other imports
import { getParam } from '@/utils/routes/routes'
import { useBasePage } from '@/composable/useBasePage'
import { WidgetService } from '@/features/dashboard/application/widgetService'
import { WidgetRepository } from '@/features/dashboard/repository/widgetRepository'
import { WidgetFormPage } from '@/features/dashboard/presentation/pages/pageWidgetForm'
import type { IWidgetType } from '@/model/widget/widgetType'
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
let form = reactive(new FormWidget())

// service
const { notificationService } = useBasePage()
const widgetService = new WidgetService(
  new WidgetRepository(),
  notificationService
)
// storage calls
const route = useRoute()

const dashboardID = getParam(route.params.did)
form.set(page.value.selectedWidget, dashboardID)
// computed
// methods
function selectWidget(data: IWidgetType) {
  page.value.changeTab(2)
  page.value.selectedWidget = data
}
function save() {
  form.set(page.value.selectedWidget, dashboardID)
  widgetService.createWidget(form)
  props.close()
}
// lifeCycle
// watch
</script>

<style scoped></style>
