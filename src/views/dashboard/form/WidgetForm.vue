<template>
  <InputCard class="h-100 forms">
    <template #header
      >{{ page.title }}

      <Tabs :tabs="page.tabs" :change="(id:number)=>page.changeTab(id)">
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
          <BoolForm v-if="page.selectedWidget.id == EWidget.Boolean" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button v-if="page.selectedTab > 1" :color="EColor.Success">Save</Button>
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
import BoolForm from '@/views/dashboard/card/BoolForm.vue'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { WidgetFormPage } from '@/model/widget/page/pageWidgetForm'
import type { IWidgetType } from '@/model/widget/widgetType'
import { EWidget } from '@/enums/dashboard/EWidget'
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

// storage calls
// computed
// methods
function selectWidget(data: IWidgetType) {
  page.value.changeTab(2)
  page.value.selectedWidget = data
}
// lifeCycle
// watch
</script>

<style scoped></style>
