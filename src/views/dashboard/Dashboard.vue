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
        :minW="4"
        @resized="updateLayout(item)"
        @moved="updateLayout(item)"
      >
        <div class="border rounded h-100 position-relative bg-light">
          <PropertyDot
            v-if="page.unlock"
            class="position-absolute top-0 end-0"
            :data="page.properties"
            @click="(p:Property)=>page.propertySelected(p.id,item)"
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
      <WidgetForm :data="page.selected" :edit="page.editForm" @close="closeForm" />
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
import { computed, onMounted, reactive } from 'vue'

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
import type { Property } from '@/model/property'
import type { IWidget } from '@/features/dashboard/domain/widget'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import { WidgetService } from '@/features/dashboard/application/widgetService'
import { WidgetRepository } from '@/features/dashboard/repository/widgetRepository'

// other imports
// props
const page = reactive(new DashboardPage())
const route = useRoute()

const dashboardID = getParam(route.params.did)

// service
useBasePage(page.title, page.path)
const widgetStore = useWidgetStore()
const { notificationService } = useBasePage()
const widgetService = new WidgetService(
  new WidgetRepository(),
  notificationService
)
// computed
const widgets = computed(() => {
  return useWidgetStore().widgets
})
// methods

function updateLayout(data: IWidget) {
  console.log('change', data)
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
  refreshData()
})
// watch
</script>

<style scoped>
.box {
  padding-bottom: 100%;
}
</style>
