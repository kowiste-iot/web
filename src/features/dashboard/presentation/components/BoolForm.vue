<template>
  <Row id="bool-form">
    <Col>
      <Row class="widget-form">
        <Boolean :data="model?.data" v-model="measure" />
      </Row>
      <Row>
        <Col :size="4">
          {{ $t('widget.form.common.measureValue') }}
        </Col>
        <Col :size="8">
          <Switch noIcon compact v-model="measure" />
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
            />
          </Col>
        </Row>
        <Row>
          <Col :size="4"> Field</Col>
          <Col>
            <Input
              :placeholder="$t('widget.form.common.labelHolder')"
              type="text"
              v-model="model.data.label"
            />
          </Col>
        </Row>
      </Group>
    </Col>
    <Col>
      <Group class="group-form" :groupText="'Widget settings'">
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
          <Col :size="4"> {{ $t('widget.bool.form.showText') }}</Col>
          <Col>
            <Switch noIcon compact v-model="model.data.options.showText" />
          </Col>
        </Row>
        <div v-if="model.data.options.showText">
          <Row>
            <Col :size="4"> {{ $t('widget.bool.form.textTrue') }}</Col>
            <Col>
              <Input
                class="col-form-label"
                placeholder=""
                type="text"
                v-model="model.data.options.trueText"
              />
            </Col>
          </Row>
          <Row>
            <Col :size="4">
              {{ $t('widget.bool.form.textFalse') }}
            </Col>
            <Col>
              <Input
                class="col-md-8 col-form-label"
                placeholder=""
                type="text"
                v-model="model.data.options.falseText"
              />
            </Col>
          </Row>
        </div>
      </Group>
    </Col>
  </Row>
</template>

<script setup lang="ts">
// imports
import { computed, reactive, ref, watch } from 'vue'

// stores import
// components import
import Boolean from './widgets/Boolean.vue'
import Input from '@/components/form/Input.vue'
import { Widget, type IWidget } from '@/features/dashboard/domain/widget'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import { useMeasureStore } from '@/features/measure/stores/useMeasureStore'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import Switch from '@/components/switch/Switch.vue'
import DropDown from '@/components/form/DropDown.vue'
import Group from '@/components/layout/Group.vue'

// model imports
// other imports
// props
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
})
// data
const form = reactive<IWidget>({} as IWidget)
const model = defineModel({ default: {} as IWidget })
const measure = ref(false)
const errors = ref<ValidationError<IWidget>>(new ValidationError())
const measureStore = useMeasureStore()
// storage calls
// computed
const measures = computed(() => measureStore.measures)
// methods
// lifeCycle
// watch
watch(
  () => form,
  () => {
    errors.value = Widget.validate(form)
  },
  {
    deep: true,
  }
)
</script>

<style scoped>
#bool-form {
  padding-top: var(--size-500);
}
.widget-form {
  padding: var(--size-500);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-md);
  background-color: var(--layout-sunken);
  margin-bottom: var(--size-500);
}
</style>
