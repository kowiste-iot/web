<template>
  <div v-if="isTenantRoute" class="vh-100 w-100">
    <AlertContainer />
    <RouterView />
  </div>

  <Flex
    v-else
    id="full"
  >
    <SideMenu />
    <AlertContainer />
    <ToursProgress v-if="showTour" />
    <PlatformTour />
    <Flex column class="w-100">
      <Header />
      <div class="flex-fill main-content">
        <div class="container-md  py-4">
          <RouterView />
        </div>
      </div>
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted, watch } from 'vue'
// stores import
// components import
import { RouterView, useRoute } from 'vue-router'
import Header from '@/components/menu/Header.vue'

import SideMenu from './features/menu/presentation/SideMenu.vue'
import AlertContainer from './features/notification/component/AlertContainer.vue'
import { loadTheme } from './utils/theme/init'
import { useAuthStore } from './plugins/security/store'
import { useScopeStore } from './features/scope/stores/useScopeStore'
import { useAssetStore } from './features/asset/stores/useAssetStore'
import { useSessionStore } from './features/session/store/useSessionStore'
import PlatformTour from './features/tour/presentation/components/PlatformTour.vue'
import { useTourStore } from './features/tour/stores/useTourStore'
import { welcomeTour } from './features/tour/tours/welcome'
import ToursProgress from './features/tour/presentation/components/ToursProgress.vue'
import { assetTour } from './features/tour/tours/asset'
import { userTour } from './features/tour/tours/user'
import { roleTour } from './features/tour/tours/roles'
import { resourceTour } from './features/tour/tours/resource'
import Flex from './components/layout/Flex.vue'
// model imports

// props
// data

// storage calls
const route = useRoute()
const authStore = useAuthStore()
const scopeStore = useScopeStore()
const assetStore = useAssetStore()
const sessionStore = useSessionStore()
const tourStore = useTourStore()
// computed
const isTenantRoute = computed(() => route.name === 'tenant')
const showTour = computed(() => sessionStore.openTour)

// methods

async function refresh() {
  await loadTheme('http://localhost:9000', undefined)
  await tourStore.registerTour(welcomeTour)
  await tourStore.registerTour(assetTour)
  await tourStore.registerTour(userTour)
  await tourStore.registerTour(roleTour)
  await tourStore.registerTour(resourceTour)
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

<style scope>
.tour {
  z-index: var(--index-god);
}
.main-content{
  overflow-y: auto;
}
#full{
overflow: hidden;
position: relative;
height: 100%;
width: 100%;
}
</style>
