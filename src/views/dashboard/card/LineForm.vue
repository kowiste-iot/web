<template>
  <div class="row">
    <div class="col-md-6">
      <div class="form-group row justify-content-center px-5 my-4">
        <Line class="" :measure="measure" :data="model.data" />
      </div>
      <div class="form-group row justify-content-center">
        <label class="col-md-4">
          {{ $t('widget.form.common.measureValue') }}
        </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="measure"
          />
        </div>
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
            v-model="model.data.options.trueEmotion"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4"> Maximun </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="'maximun true emotion'"
          type="number"
          v-model="model.data.options.max"
        />
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4"> Minimun </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="'minimun true emotion'"
          type="number"
          v-model="model.data.options.min"
        />
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ 'Show Legend' }}
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
          {{ 'Fill' }}
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
          {{ 'Color' }}
        </label>
        <div class="col-md-8">
          <ColorPicker  v-model="model.data.options.color"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
// components import
import Line from './Line.vue'
import Input from '@/components/form/Input.vue'
import { type IFormWidget } from '@/model/widget/form/formWidget'
import ColorPicker from '@/components/color/ColorPicker.vue'

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
const model = defineModel({ default: {} as IFormWidget })
const measure = ref(false)
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
