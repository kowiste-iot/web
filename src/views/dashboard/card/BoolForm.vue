<template>
  <div class="row">
    <div class="col-md-6">
      <div class="form-group row justify-content-center px-5 my-4">
        <Boolean class="" :measure="t.measure" :data="t" />
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
            v-model="t.measure"
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
          v-model="t.label"
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
            v-model="t.showLabel"
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
            v-model="t.emotion"
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
            v-model="t.options.trueEmotion"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4"> {{ $t('widget.bool.form.showText') }} </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="t.options.showText"
          />
        </div>
      </div>
      <div v-if="t.options.showText">
        <div class="form-group row justify-content-center mb-1">
          <label class="col-md-4 col-form-label">
            {{ $t('widget.bool.form.textTrue') }}
          </label>
          <Input
            class="col-md-8 col-form-label"
            placeholder=""
            type="text"
            v-model="t.options.trueText"
          />
        </div>
        <div class="form-group row justify-content-center mb-3">
          <label class="col-md-4 col-form-label">
            {{ $t('widget.bool.form.textFalse') }}
          </label>
          <Input
            class="col-md-8 col-form-label"
            placeholder=""
            type="text"
            v-model="t.options.falseText"
          />
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
import Boolean from './Boolean.vue'
import Input from '@/components/form/Input.vue'
import { EIcon } from '@/enums/gui/EIcon'
import { EColor } from '@/enums/gui/EColor'

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
let t = ref({
  showLabel: true,
  options: {},
} as any)
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
