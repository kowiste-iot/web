<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center full-height"
  >
    <h1 class="alt">404</h1>
    <h1>{{ $t('error.page404') }}</h1>
    <Button
      class="my-4"
      :color="EColor.Warning"
      :icon="EIcon.Home"
      @click="goToHome"
      >Home</Button
    >
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
import { useRouter } from 'vue-router'
import { useBreadCrumb } from '@/features/shared/store/breadcrumb'

// components import
import Button from '@/components/buttons/Button.vue'

// model imports
import { EIcon } from '@/features/shared/enum/EIcon'
import { EColor } from '@/features/shared/enum/EColor'
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
const router = useRouter()
const storeCrumb = useBreadCrumb()
storeCrumb.reset()
// computed
// methods
function goToHome() {
  router.push('/')
}
// lifeCycle
// watch
</script>

<style scoped>
.alt {
  font-size: 15rem;
}
</style>
