<template>
  <Card id="widget-form" showHeader showFooter>
    <template #header>
      {{ page.title }}
      <Tabs :tabs="page.tabs" @change="(id:number)=>page.changeTab(id)">
        <template #default="{ data }"> {{ data.name }}</template>
      </Tabs>
    </template>
    <Container>
      <Row
        id="widget-selection-card"
        v-if="page.selectedTab == 1"
        class="row-widget"
      >
        <Col
          v-for="widget in page.widgets"
          :breakpoint="EBreakpoint.LG"
          :size="3"
        >
          <WidgetFormCard
            class="widget-card"
            :data="widget"
            @click="selectWidget"
          />
        </Col>
      </Row>
      <div class="full-size" v-else>
        <div v-if="page.selectedWidget.id == EWidget.None">
          Select a widget first
        </div>
        <div class="full-size" v-else>
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
      <Button :color="EColor.Secondary" outline @click="emit('close')">
        {{ $t('actionGUI.cancel') }}
      </Button>
    </template>
  </Card>
</template>

<script setup lang="ts">
// imports
import { onMounted, reactive, ref, watch } from 'vue'
// stores import
import { useRoute } from 'vue-router'
// components import
import Button from '@/components/buttons/Button.vue'
import Tabs from '@/components/tab/Tabs.vue'
import BoolForm from '@/features/dashboard/presentation/components/BoolForm.vue'
import NumberForm from '@/features/dashboard/presentation/components/NumberForm.vue'
import GaugeForm from '@/features/dashboard/presentation/components/GaugeForm.vue'
import LineForm from '@/features/dashboard/presentation/components/LineForm.vue'
import BarForm from '@/features/dashboard/presentation/components/BarForm.vue'
import PieForm from '@/features/dashboard/presentation/components/PieForm.vue'
import TextForm from '@/features/dashboard/presentation/components/TextForm.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EWidget } from '@/features/dashboard/domain/EWidget'
// other imports
import { getParam } from '@/utils/routes/routes'
import { useBasePage } from '@/composable/useBasePage'
import { WidgetService } from '@/features/dashboard/application/widgetService'
import { WidgetRepository } from '@/features/dashboard/repository/widgetRepository'
import { WidgetFormPage } from '@/features/dashboard/presentation/pages/pageWidgetForm'
import type { IWidgetType } from '@/features/shared/domain/widgetType'
import {
  type IWidget,
  type IWidgetData,
  type IWidgetLinkData,
} from '@/features/dashboard/domain/widget'
import { useMeasureStore } from '@/features/measure/stores/useMeasureStore'
import Container from '@/components/layout/Container.vue'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import { EBreakpoint } from '@/components/layout/grid/model'
import WidgetFormCard from '@/features/dashboard/presentation/components/WidgetFormCard.vue'
import Card from '@/components/cards/Card.vue'
import { ValidationError } from '@/features/shared/domain/baseValidator'
// props
interface Props {
  data?: IWidget
  edit: boolean
}

const props = withDefaults(defineProps<Props>(), {
  edit: false,
})
const emit = defineEmits<{
  close: []
}>()

// data
const page = reactive(new WidgetFormPage())

const form = reactive<IWidget>({
  ...props.data,
  id: props.data?.id ?? '',
  dashboardID: props.data?.dashboardID ?? '',
  type: props.data?.type ?? EWidget.Boolean,
  i: props.data?.i ?? 0,
  x: props.data?.x ?? 0,
  y: props.data?.y ?? 0,
  w: props.data?.w ?? 4,
  h: props.data?.h ?? 3,
  data:
    props.data?.data ??
    ({ options: {}, link: [{ measure: '' }] } as IWidgetData),
})
const errors = ref<ValidationError<IWidget> | null>(new ValidationError())

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
  form.type = data.id
}
async function save() {
  form.dashboardID = dashboardID
  if (props.edit) {
    errors.value = await widgetService.updateWidget(dashboardID, form)
  } else {
    errors.value = await widgetService.createWidget(dashboardID, form)
  }
  if (errors.value?.hasErrors()) return
  emit('close')
}
// lifeCycle
onMounted(() => {
  measureStore.fetchMeasures()
})
// watch
watch(
  () => props.edit,
  (edit) => {
    //pass to true
    if (edit) {
      const found = page.widgets.find((widget) => widget.id == props.data?.type)
      if (!found) return
      if (props.data?.data.link && props.data?.data.link.length > 0) {
        form.data.link = props.data?.data.link
      }
      selectWidget(found)
    }
  },
  { immediate: true }
)
watch(
  () => form,
  () => {
    if (!form.data.link) form.data.link = new Array<IWidgetLinkData>()
    if (form.data.link.length < 1) form.data.link.push({} as IWidgetLinkData)
  },
  {
    once: true,
  }
)
</script>

<style scoped>
.row-widget {
  overflow-y: auto;
  margin-top: var(--size-400);
}
.widget-card {
  padding: var(--size-100);
}
#widget-form {
  height: 100% !important;
}
</style>
