<template>
  <div class="full-size grid-top-layout">
    <Grid
      class="full-height"
      :cols="24"
      :rowHeight="2"
      :margin="0.5"
      :draggable="page.unlock"
      :resizable="page.unlock"
    >
      <GridItem
        v-for="item in widgets"
        :i="item.id"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :z-index="1"
        @moved="updateLayout"
        @resized="updateLayout"
      >
        <div class="widget-card-layout">
          <PropertyDot
            v-if="page.unlock"
            class="widget-card-property"
            :data="page.properties"
            @click="(p:Property)=>page.propertySelected(p.id,item)"
          />
          <BoolWidget
            v-if="item.type == EWidget.Boolean"
            :measure="false"
            :data="item.data"
            v-model="measures"
          />
          <NumberWidget
            v-if="item.type == EWidget.Number"
            :data="item.data"
            v-model="measures"
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
    </Grid>
  </div>
  <Flex column style="position: fixed; top: 4rem; right: 1rem">
    <FIcon
      :class="`text-${EColor.Success}`"
      :icon="EIcon.Add"
      role="button"
      style="height: 1.5rem"
      @click="() => (page.showForm = true)"
    />
    <FIcon
      class="mt-3"
      :class="`text-${EColor.Secondary}`"
      :icon="page.unlock ? EIcon.UnLock : EIcon.Lock"
      role="button"
      style="height: 1.5rem"
      @click="() => (page.unlock = !page.unlock)"
    />
  </Flex>

  <Modal v-if="page.showForm">
    <SideCard :size="12">
      <WidgetForm
        :data="page.selected"
        :edit="page.editForm"
        @close="closeForm"
      />
    </SideCard>
  </Modal>
  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('actionGUI.delete')"
    @action="deleteItem"
    @cancel="closeForm"
  >
    <div class="text-center">{{ $t('asset.delete') }}</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

// components import
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import WidgetForm from '@/views/dashboard/form/WidgetForm.vue'
import BarWidget from '@/features/dashboard/presentation/components/widgets/Bar.vue'
import BoolWidget from '@/features/dashboard/presentation/components/widgets/Boolean.vue'
import NumberWidget from '@/features/dashboard/presentation/components/widgets/Number.vue'
import LineWidget from '@/features/dashboard/presentation/components/widgets/Line.vue'
import PieWidget from '@/features/dashboard/presentation/components/widgets/Pie.vue'
import TextWidget from '@/features/dashboard/presentation/components/widgets/Text.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { DashboardPage } from '@/features/dashboard/presentation/pages/pageDashboard'
import { EWidget } from '@/features/dashboard/domain/EWidget'
import { useBasePage } from '@/composable/useBasePage'
import { useWidgetStore } from '@/features/dashboard/stores/useWidgetStore'
import { getParam } from '@/utils/routes/routes'
import { useRoute } from 'vue-router'
import Flex from '@/components/layout/Flex.vue'
import Modal from '@/components/layout/Modal.vue'
import type { Property } from '@/features/shared/domain/property'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import { WidgetService } from '@/features/dashboard/application/widgetService'
import { WidgetRepository } from '@/features/dashboard/repository/widgetRepository'
import { useDashboardStore } from '@/features/dashboard/stores/useDashboardStore'
import Grid from '@/components/layout/gridlayout/Grid.vue'
import GridItem from '@/components/layout/gridlayout/GridItem.vue'
import { useWebsocketStore } from '@/plugins/websocket/store/store'
import {
  EWebsocketMessageType,
  WebsocketMessage,
} from '@/plugins/websocket/domain/model'
import { WebsocketMapper } from '@/plugins/websocket/domain/websocketMappers'
import type { IMeasureData } from '@/features/shared/domain/measureData'

// other imports
// props
const page = reactive(new DashboardPage())
const route = useRoute()

const dashboardID = getParam(route.params.did)
//data
const fff = ref(5768.7867867)
// service
useBasePage(page.title, page.path)
const widgetStore = useWidgetStore()
const dashboardStore = useDashboardStore()
const { notificationService } = useBasePage()
const widgetService = new WidgetService(
  new WidgetRepository(),
  notificationService
)
const measures = ref<IMeasureData>()
const websocketStore = useWebsocketStore()
// computed
const widgets = computed(() => {
  return useWidgetStore().widgets
})
const widgetsMeasure = computed(() => {
  return useWidgetStore().uniqueMeasures
})
// methods

async function updateLayout(event: {
  i: string | number
  x: number
  y: number
  w: number
  h: number
}) {
  const widget = widgets.value.find((w) => w.id === event.i)
  if (widget) {
    widget.x = event.x
    widget.y = event.y
    widget.w = event.w
    widget.h = event.h
    await widgetService.updateWidgetPosition(dashboardID, widget)
    closeForm()
  }
}
async function deleteItem() {
  await widgetService.deleteWidget(dashboardID, page.selected!.id!)
  closeForm()
}
function closeForm() {
  refreshData()
  page.reset()
}
async function refreshData() {
  await widgetStore.fetchWidgets(dashboardID)
}
// lifeCycle
onMounted(() => {
  dashboardStore.fetchDashboards()
  refreshData()
  websocketStore.addmsgHandler(
    EWebsocketMessageType.MeasureUpdate,
    (msg: string) => {
      const test = WebsocketMapper.toMeasureUpdateDomain(msg)
      measures.value = test
    }
  )
})
onUnmounted(() => {
  //unsubscribe
})
// watch
watch(
  () => dashboardStore.dashboards,
  () => {
    const found = dashboardStore.dashboards.find(
      (dash) => dash.id == dashboardID
    )
    if (!found) return
    useBasePage('dashboard/ ' + found.name, page.path)
  },
  {
    once: true,
  }
)
watch(
  () => widgetsMeasure.value,
  () => {

    if (widgetsMeasure.value && widgetsMeasure.value.length > 0) {
      const msg = new WebsocketMessage(EWebsocketMessageType.Subscribe, {
        measures: widgetsMeasure.value,
      })
      websocketStore.send(msg.toJSON())
    }
  },
  {
    immediate: true,
  }
)
</script>

<style scoped>
.box {
  padding-bottom: 100%;
}
.grid-top-layout {
  margin-top: var(--size-200);
}
.widget-card-layout {
  height: 100%;
  position: relative;
}
.widget-card-property {
  position: absolute !important;
  top: 0;
  right: 0;
  z-index: var(--index-god);
}
</style>
