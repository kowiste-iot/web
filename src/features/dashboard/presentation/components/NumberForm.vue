<template>
  <Row>
    <Col>
      <Row class="widget-form">
        <Number :data="model?.data" v-model="measure" style="height: 8rem" />
      </Row>
      <Row>
        <Col :size="4">
          {{ $t('widget.form.common.measureValue') }}
        </Col>
        <Col :size="8">
          <Input
            :placeholder="$t('widget.form.common.labelHolder')"
            type="number"
            v-model="measure.data[model.data.link[0].tag]"
          />
        </Col>
      </Row>

      <Group class="group-form" :groupText="'Link measure'">
        <Row>
          <Col :size="4"> {{ $t('widget.form.common.measureValue') }}</Col>
          <Col>
            <DropDown
              :options="measures"
              labelField="name"
              valueField="id"
              :placeholder="$t('measure.form.parentHolder')"
              @change="changeMeasure"
              v-model="measureID"
            />
          </Col>
        </Row>
        <Row>
          <Col :size="4"> Field</Col>
          <Col>
            <Input
              :placeholder="$t('widget.form.common.labelHolder')"
              type="text"
              @change="changeMeasure"
              v-model="tag"
            />
          </Col>
        </Row> </Group
    ></Col>
    <Col>
      <Row>
        <Col :size="4">{{ $t('widget.form.common.label') }}</Col>
        <Col>
          <Input
            :placeholder="$t('widget.form.common.labelHolder')"
            type="text"
            v-model="model.data.label"
          />
        </Col>
      </Row>
      <Row>
        <Col :size="4"> {{ $t('widget.form.common.showLabel') }}</Col>
        <Col>
          <Switch noIcon compact v-model="model.data.showLabel" />
        </Col>
      </Row>
      <Row>
        <Col :size="4">{{ $t('widget.form.common.emotion') }}</Col>
        <Col>
          <Switch noIcon compact v-model="model.data.showEmotion" />
        </Col>
      </Row>
      <Row>
        <Col :size="4"> {{ $t('widget.bool.form.trueEmotion') }}</Col>
        <Col>
          <Switch noIcon compact v-model="model.data.trueEmotion" />
        </Col>
      </Row>
      <Row>
        <Col :size="4">{{ $t('widget.number.form.showDecimal') }}</Col>
        <Col>
          <Switch noIcon compact v-model="model.data.options.showDecimal" />
        </Col>
      </Row>
      <Row>
        <Col :size="4">{{ $t('widget.number.form.showUnit') }}</Col>
        <Col>
          <Switch noIcon compact v-model="model.data.options.showUnit" />
        </Col>
      </Row>
      <Row v-if="model.data.options.showUnit">
        <Col :size="4">{{ $t('widget.number.form.unit') }}</Col>
        <Col>
          <Input placeholder="" type="text" v-model="model.data.options.unit" />
        </Col>
      </Row>
    </Col>
  </Row>
</template>

<script setup lang="ts">
// imports
import { computed, ref } from 'vue'

// stores import
// components import
import Number from './widgets/Number.vue'
import Input from '@/components/form/Input.vue'
import type {
  IWidget,
  IWidgetLinkData,
} from '@/features/dashboard/domain/widget'
import Group from '@/components/layout/Group.vue'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import DropDown from '@/components/form/DropDown.vue'
import { useMeasureStore } from '@/features/measure/stores/useMeasureStore'
import Switch from '@/components/switch/Switch.vue'
import {
  MeasureData,
  type IMeasureData,
} from '@/features/shared/domain/measureData'

// model imports
// other imports
// props
const model = defineModel({ default: {} as IWidget })
const measureID = ref('')
const tag = ref('')
// data
const measure = ref<IMeasureData>(new MeasureData())
// storage calls
const measureStore = useMeasureStore()

// computed
const measures = computed(() => measureStore.measures)

// methods
function changeMeasure() {
  if (!model.value.data.link)
    model.value.data.link = new Array<IWidgetLinkData>()
  if (model.value.data.link.length < 1)
    model.value.data.link.push({} as IWidgetLinkData)
  model.value.data.link[0].measure = measureID.value
  model.value.data.link[0].tag = tag.value
}

// lifeCycle
// watch
</script>

<style scoped>
.widget-form {
  padding: var(--size-500);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-md);
  background-color: var(--layout-sunken);
  margin-bottom: var(--size-500);
}
</style>
