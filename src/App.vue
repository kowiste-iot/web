<template>
  <div v-if="isTenantRoute" class="vh-100 w-100">
    <AlertContainer />
    <RouterView />
  </div>

  <div id="full" v-else>
    <AlertContainer />
    <ToursProgress v-if="showTour" />
    <PlatformTour />

    <Flex>
      <SideMenu
        id="layout-sidemenu"
        class="layout-sidemenu"
        @close="toggleMenu()"
      />
      <Flex class="layout-content" column>
        <Flex>
          <FIcon
            class="burger-button"
            :icon="EIcon.Burger"
            role="button"
            @click="toggleMenu()"
          />
          <Header class="layout-header" />
        </Flex>
        <Container class="layout-main">
          <RouterView />
        </Container>
      </Flex>
    </Flex>
  </div>
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
import { EIcon } from './features/shared/enum/EIcon'
import Flex from './components/layout/Flex.vue'
import Container from './components/layout/Container.vue'
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
function toggleMenu() {
  const sideMenu = document.getElementById('layout-sidemenu')
  if (sideMenu) sideMenu.classList.toggle('active')
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

#full {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.burger-button {
  display: none;
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-sm);
  padding: var(--size-050);
  background-color: var(--layout-overlaay);
  height: var(--size-300);
  width: var(--size-300);
  cursor: pointer;
}
.layout-sidemenu {
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
}
.layout-content {
  flex: 1;
}
.layout-header {
  max-height: fit-content;
  flex: 1;
}

@media (max-width: 768px) {
  .burger-button {
    display: block;
    z-index: var(--index-overlay-1);
  }
  .layout-sidemenu {
    position: fixed;
    transform: translateX(-100%);
  }
  .layout-header {
    flex: 1;
  }
  .layout-sidemenu.active {
    width: 100%;
    transform: translateX(0);
    z-index: var(--index-overlay);
  }
}
</style>
