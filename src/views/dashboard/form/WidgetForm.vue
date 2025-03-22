<template>
  <InputCard class="h-100 forms" showHeader showFooter>
    <template #header
      >{{ page.title }}

      <Tabs :tabs="page.tabs" :onChange="(id:number)=>page.changeTab(id)">
        <template #default="{ data }"> {{ data.name }}</template>
      </Tabs>
    </template>
    <Container>
      <Row v-if="page.selectedTab == 1" class="row-widget">
        <Col
          v-for="widget in page.widgets"
          :breakpoint="EBreakpoint.LG"
          :size="3"
        >
          <WidgetFormCard class="widget-card" :data="widget" @click="selectWidget"/>
        </Col>
      </Row>
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
    </Container>

    <template #footer>
      <Button
        v-if="page.selectedTab > 1"
        :color="EColor.Success"
        @click="save"
        >{{ $t('actionGUI.save') }}</Button
      >
      <div v-else></div>
      <Button :color="EColor.Secondary" outline @click="close()">
        {{ $t('actionGUI.cancel') }}
      </Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { onMounted, reactive } from 'vue'
// stores import
import { useRoute } from 'vue-router'
// components import
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import Tabs from '@/components/tab/Tabs.vue'
import BoolForm from '@/features/dashboard/presentation/components/BoolForm.vue'
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
import { Widget } from '@/features/dashboard/domain/widget'
import { useMeasureStore } from '@/features/measure/stores/useMeasureStore'
import Container from '@/components/layout/Container.vue'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import { EBreakpoint } from '@/components/layout/grid/col'
import WidgetFormCard from '@/features/dashboard/presentation/components/WidgetFormCard.vue'
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
const page = reactive(new WidgetFormPage())
let form = reactive(new Widget())

// service
const { notificationService } = useBasePage()
const widgetService = new WidgetService(
  new WidgetRepository(),
  notificationService
)
// storage calls
const route = useRoute()
const measureStore = useMeasureStore()

const dashboardID = getParam(route.params.did)
// computed
// methods
function selectWidget(data: IWidgetType) {
  page.changeTab(2)
  page.selectedWidget = data
}
function save() {
  form.set(page.selectedWidget, dashboardID)
  const ok = widgetService.createWidget(dashboardID, form)
  if (!ok) return
  props.close()
}
// lifeCycle
onMounted(() => {
  measureStore.fetchMeasures()
})
// watch
</script>

<style scoped>
.row-widget {
  overflow-y: auto;
  margin-top: var(--size-400);
}
.widget-card {
  padding: var(--size-100);
}
</style>
