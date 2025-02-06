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
    <div
      v-if="showTour"
      class="position-absolute tour"
      style="height: 100%; width: 100%"
    >
      <div
        class="bg-dark opacity-50 position-absolute"
        style="height: 100%; width: 100%"
      ></div>
      <div class="position-relative h-100">
        <div class="container h-100">
          <div class="row h-100 align-items-center">
            <div class="col-md-8 mx-auto">
              <Card showHeader showFooter>
                <template #header>header</template>
                <template #footer>
                  <Button
                    :color="EColor.Success"
                    @click="
                      () => {
                        tourStore.startTour('example-tour')
                        sessionStore.openTour = false
                      }
                    "
                  >
                    Follow
                  </Button>
                  <Button
                    :color="EColor.Secondary"
                    outline
                    @click="sessionStore.openTour = false"
                  >
                    Cancel
                  </Button></template
                >
                Tour
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PlatformTour />
    <div class="d-flex flex-column w-100 m-0 p-0">
      <Header />
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
import Button from '@/components/buttons/Button.vue'

import SideMenu from './features/menu/component/SideMenu.vue'
import AlertContainer from './features/notification/component/AlertContainer.vue'
import Card from '@/components/cards/Card.vue'
import { loadTheme } from './utils/theme/init'
import { useAuthStore } from './plugins/security/store'
import { useScopeStore } from './features/scope/stores/useScopeStore'
import { useAssetStore } from './features/asset/stores/useAssetStore'
import { useSessionStore } from './features/session/store/useSessionStore'
import { EColor } from './features/shared/enum/EColor'
import PlatformTour from './features/tour/presentation/components/PlatformTour.vue'
import { useTourStore } from './features/tour/stores/useTourStore'
import { exampleTour } from './features/tour/tours/example'
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
  await tourStore.registerTour(exampleTour)
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
  z-index: 9000;
}
</style>
