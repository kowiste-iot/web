<template>
  <div class="d-flex justify-content-start">
    <div role="button" @click="goToHome">
      <FIcon
        class="pe-3"
        :icon="EIcon.Home"
        style="height: 1rem; width: 1rem"
      />
    </div>
    /
    <div v-for="element in data.path"  class="ms-2" role="button" @click="goTo(element.path)">
      {{ element.name }}  /
    </div>
    <div class="ms-2">{{ data.page }}</div>
  </div>
</template>

<script setup lang="ts">
// imports
import { computed } from 'vue'
// stores import
import { useRouter } from 'vue-router'
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
// components import
// model imports
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props

// data

// storage calls
const router = useRouter()
const storeCrumb = useBreadCrumb()
// computed
const data = computed(() => {
  return storeCrumb.data
})
// methods
function goToHome() {
  router.push('/')
}
function goTo(selected: string) {
  const foundIndex = data.value.path.findIndex((element) => {
    return element.path == selected
  })
  let path = ''
  for (let i = 0; i <= foundIndex; i++) {
    path += '/' + data.value.path[i].path
  }
router.push(path)
}
// lifeCycle
// watch
</script>

<style scoped></style>
