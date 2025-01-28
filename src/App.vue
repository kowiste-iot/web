<template>
  <div v-if="isTenantRoute" class="vh-100 w-100">
    <AlertContainer />
    <RouterView />
  </div>

  <div
    v-else
    class="d-flex align-items-stretch h-100 w-100 position-relative p-0 m-0"
  >
    <SideMenu />
    <AlertContainer />
    <div class="d-flex flex-column w-100 m-0 p-0">
      <Header />
      <div class="bg-primary">dsgfa</div>
      <div class="flex-fill h-100 m-0 p-0">
        <div class="container-md h-100 pt-4 pb-0 mb-0">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted, watch } from 'vue'
// stores import
// components import
import { RouterView, useRoute } from 'vue-router'
import Header from '@/components/menu/Header.vue'
import SideMenu from './features/menu/component/SideMenu.vue'
import AlertContainer from './features/notification/component/AlertContainer.vue'
import { loadTheme } from './utils/theme/init'
import { useAuthStore } from './plugins/security/store'
import { useScopeStore } from './features/scope/stores/useScopeStore'
import { useAssetStore } from './features/asset/stores/useAssetStore'
// model imports

// props
// data

// storage calls
const route = useRoute()
const authStore = useAuthStore()
const scopeStore = useScopeStore()
const assetStore = useAssetStore()
// computed
const isTenantRoute = computed(() => route.name === 'tenant')

// methods

async function refresh() {
  await loadTheme('http://localhost:9000', undefined)
}

// lifeCycle
onMounted(() => {
  refresh()
})

// watch
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      //fetch here 'static' data
      scopeStore.fetchScopes()
      assetStore.fetchAssets()
    }
  },
  { immediate: true }
)
</script>

<style scope></style>
