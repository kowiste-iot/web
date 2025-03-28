<template>
  <div class="row">
    <div class="col-md-6 form-group row justify-content-center">
      <label class="col-md-2 col-form-label">
        {{ $t('widget.form.common.label') }}
      </label>
      <Input
        class="col-md-8 col-form-label"
        :placeholder="$t('widget.form.common.labelHolder')"
        type="text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
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
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
