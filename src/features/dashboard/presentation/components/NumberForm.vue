<template>
  <div class="row">
    <div class="col-md-6">
      <div class="form-group row justify-content-center px-5 my-4">
        <Number class="" :data="model.data" v-model="measure" />
      </div>
      <div class="form-group row justify-content-center">
        <label class="col-md-4">
          {{ $t('widget.form.common.measureValue') }}
        </label>
        <Input
          class="col-md-8 col-form-label"
          :placeholder="$t('widget.form.common.labelHolder')"
          type="number"
          v-model="measure"
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
            v-model="model.data.options.trueEmotion"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ $t('widget.number.form.showDecimal') }}
        </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="model.data.options.showDecimal"
          />
        </div>
      </div>
      <div class="form-group row justify-content-center mb-3">
        <label class="col-md-4">
          {{ $t('widget.number.form.showUnit') }}
        </label>
        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="model.data.options.showUnit"
          />
        </div>
      </div>
      <div
        v-if="model.data.options.showUnit"
        class="form-group row justify-content-center mb-1"
      >
        <label class="col-md-4 col-form-label">
          {{ $t('widget.number.form.unit') }}
        </label>
        <Input
          class="col-md-8 col-form-label"
          placeholder=""
          type="text"
          v-model="model.data.options.unit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
// components import
import Number from './widgets/Number.vue'
import Input from '@/components/form/Input.vue'
import type { IWidget } from '@/features/dashboard/domain/widget'

// model imports
// other imports
// props
const model = defineModel({ default: {} as IWidget })

// data
const measure = ref(0)
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
