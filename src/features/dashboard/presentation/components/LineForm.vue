<template>
  <div class="row">
    <div class="col-md-6">
      <div class="form-group row justify-content-center px-5 my-4">
        <Line :data="model.data" :duration="5" v-model="page.measure" />
      </div>
      <div class="form-group row justify-content-center">
        <label class="col-md-4">
          {{ $t('widget.form.common.measureValue') }}
        </label>
        <Input
          class="col-md-6 col-form-label"
          :placeholder="$t('widget.form.common.labelHolder')"
          type="number"
          v-model="measure"
        />
        <div class="col-md-2 col-form-label">
          <Button
            :disabled="String(model.data.link[0].tag).isEmpty()"
            :icon="EIcon.Add"
            :color="EColor.Primary"
            @click="addMeasure"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4 col-form-label">
          {{ 'measure' }}
        </label>
        <DropDown
          v-if="model.data.link.length != 0"
          class="col-md-8"
          valueField="name"
          labelField="name"
          :placeholder="$t('widget.line.form.measureHolder')"
          :options="measures"
          v-model="model.data.link[0].measure"
        >
          <template #option="{ data }">
            {{ data.name }}
          </template>
        </DropDown>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4 col-form-label">
          {{ $t('widget.line.form.tag') }}
        </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="
            !model.data.link[0].measure
              ? $t('widget.line.form.tagHolderBad')
              : $t('widget.line.form.tagHolder')
          "
          :disabled="!model.data.link[0].measure"
          type="text"
          v-model="model.data.link[0].tag"
        />
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4 col-form-label">
          {{ $t('widget.line.form.legend') }}
        </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="$t('widget.line.form.legendHolder')"
          type="text"
          v-model="model.data.link[0].legend"
        />
      </div>
    </div>

    <div class="col-md-6">
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4 col-form-label">
          {{ $t('widget.form.common.label') }}
        </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="$t('widget.form.common.labelHolder')"
          type="text"
          v-model="model.data.label"
        />
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ $t('widget.form.common.showLabel') }}
        </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="model.data.showLabel"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4"> {{ $t('widget.form.common.emotion') }} </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="model.data.showEmotion"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ $t('widget.bool.form.trueEmotion') }}
        </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="model.data.trueEmotion"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4"> {{ $t('widget.line.form.max') }} </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="$t('widget.line.form.maxHolder')"
          type="number"
          v-model="model.data.options.max"
        />
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">{{ $t('widget.line.form.min') }} </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="$t('widget.line.form.minHolder')"
          type="number"
          v-model="model.data.options.min"
        />
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ $t('widget.line.form.showLegend') }}
        </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="model.data.options.showLegend"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ $t('widget.line.form.fill') }}
        </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="model.data.options.fill"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ $t('widget.line.form.color') }}
        </label>
        <div class="col-md-8">
          <ColorPicker v-model="model.data.options.color" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, reactive, computed } from 'vue'

// stores import

// components import
import Line from './widgets/Line.vue'
import Input from '@/components/form/Input.vue'
import ColorPicker from '@/components/color/ColorPicker.vue'
import Button from '@/components/buttons/Button.vue'
import DropDown from '@/components/form/DropDown.vue'

// model imports
import { WidgetLineFormPage } from '@/features/dashboard/presentation/pages/pageWidgetLineForm'
import { DataModel } from '@/features/shared/domain/data'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EColor } from '@/features/shared/enum/EColor'
import { useMeasureStore } from '@/features/measure/stores/useMeasureStore'
import type { IWidget } from '@/features/dashboard/domain/widget'
// other imports
// props
const model = defineModel({
  default: {
    data: {
      link: [{}],
    },
  } as IWidget,
})

// data
const page = reactive(new WidgetLineFormPage())
const measure = ref(0)
// storage calls

// computed
const measures = computed(() => {
  return useMeasureStore().measures
})
// methods
function addMeasure() {
  const m = new DataModel({
    id: model.value.data.link[0].measure,
    values: {
      temperature: measure.value,
    },
    ts: new Date(),
  })
  page.measure = []
  page.measure.push(m.get())
  measure.value = 0
}
// lifeCycle
// watch
</script>

<style scoped></style>
