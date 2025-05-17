<template>
  <div v-if="isTenantRoute" class="page-size">
    <AlertContainer />
    <RouterView />
  </div>

  <div id="full" v-else-if="isReady">
    <AlertContainer />
    <ToursProgress v-if="showTour" />
    <PlatformTour />

    <Flex class="full-height">
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

  <div v-else class="loading-container">
    <!-- Show loading state while initializing -->
    <div class="loading-spinner"></div>
    <p>Loading application...</p>
  </div>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted, watch, onBeforeUnmount, nextTick, ref } from 'vue'
// stores import
// components import
import { RouterView, useRoute } from 'vue-router'
import Header from '@/components/menu/Header.vue'

import SideMenu from './features/menu/presentation/SideMenu.vue'
import AlertContainer from './features/notification/component/AlertContainer.vue'
import { loadTheme } from './utils/theme/init'
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
import { useWebsocketStore } from './plugins/websocket/store/store'
import {
  EConnectionStatus,
  EWebsocketMessageType,
  type IWebsocketMessage,
} from './plugins/websocket/domain/model'
import type { AxiosError } from 'axios'
import { keycloakService } from './plugins/security/KeycloakService'
import { isPublicRoute } from './plugins/security/utils'
import logger from './utils/log/logger'

// Add a state to track app readiness
const isReady = ref(false)
const themeLoaded = ref(false)
const toursRegistered = ref(false)
const dataInitialized = ref(false)
// model imports

// props

// storage calls
const route = useRoute()
const scopeStore = useScopeStore()
const assetStore = useAssetStore()
const sessionStore = useSessionStore()
const tourStore = useTourStore()
const websocketStore = useWebsocketStore()

// data
const websocketInitialized = ref(false) // Track WebSocket initialization
const debouncedInitialize = debounce(initializeAppData, 300) // Debounced initialization
let lastAuthState = keycloakService.isAuthenticated.value // Track the last authentication state to prevent redundant processing
let lastBranch = sessionStore.getCurrentBranch

// computed
const isTenantRoute = computed(() => isPublicRoute(String(route.name)))
const showTour = computed(() => sessionStore.openTour)
const canInitializeServices = computed(
  () =>
    keycloakService.isAuthenticated.value &&
    keycloakService.token &&
    !isTenantRoute.value
)

// methods
async function refresh() {
  try {
    await loadTheme('http://localhost:9000', undefined)
    themeLoaded.value = true

    await tourStore.registerTour(welcomeTour)
    await tourStore.registerTour(assetTour)
    await tourStore.registerTour(userTour)
    await tourStore.registerTour(roleTour)
    await tourStore.registerTour(resourceTour)
    toursRegistered.value = true

    // Mark app as ready once everything is loaded
    checkReadiness()
  } catch (error) {
    logger.error('Error during refresh:', error)
    // Still mark as ready to avoid blocking the UI
    checkReadiness()
  }
}

// Check if app is ready to display
function checkReadiness() {
  if (themeLoaded.value && toursRegistered.value) {
    isReady.value = true
  }
}

function toggleMenu() {
  const sideMenu = document.getElementById('layout-sidemenu')
  if (sideMenu) sideMenu.classList.toggle('active')
}

// WebSocket message handler
function handleWebSocketMessage(message: IWebsocketMessage) {
  logger.debug('Received WebSocket message:', message)

  // Handle different message types
  switch (message.type) {
    case EWebsocketMessageType.Subscribe:
      logger.debug('Subscription update:', message.content)
      // Update relevant stores based on the message
      break
    // Add other message type handlers as needed
    default:
      logger.warn('Unknown message type:', message.type)
  }
}


// Initialize WebSocket connection
async function initializeWebSocket() {
  try {
    // Check authentication status
    if (!keycloakService.isAuthenticated.value || !keycloakService.token) {
      logger.error('Not authenticated, skipping WebSocket initialization')
      return
    }

    // Check if websocket service is ready
    if (!websocketStore.isReady) {
      logger.info('Initializing WebSocket service')
      websocketStore.initializeService()

      // Register event handlers only once
      websocketStore.onConnect((data: any) => {
        logger.debug('WebSocket connected', data)
      })

      websocketStore.onError((error: any) => {
        logger.error('WebSocket error', error)
      })

      websocketStore.onClose((event: any) => {
        logger.debug('WebSocket closed', event)

        // Only attempt to reconnect if authenticated and the service was previously initialized
        if (
          keycloakService.isAuthenticated.value &&
          websocketInitialized.value
        ) {
          // Use a delayed reconnect to avoid immediate reconnection loops
          setTimeout(() => {
            if (keycloakService.isAuthenticated.value) {
              logger.warn('Attempting to reconnect WebSocket after close')
              initializeWebSocket()
            }
          }, 2000)
        }
      })

      // Register message handlers
      websocketStore.addmsgHandler('measure', handleWebSocketMessage)

      websocketInitialized.value = true
    }

    // Check current connection status
    if (websocketStore.status === EConnectionStatus.Open) {
      logger.warn('WebSocket already connected, skipping')
      return
    }

    // Connect to WebSocket with token
    logger.debug('Connecting to WebSocket')
    await websocketStore.connect()
  } catch (error) {
    logger.error(
      'Failed to initialize WebSocket:',
      (error as AxiosError).message
    )
  }
}

// Disconnect WebSocket connection
function disconnectWebSocket() {
  if (
    websocketStore.isReady &&
    websocketStore.status === EConnectionStatus.Open
  ) {
    logger.warn('Disconnecting WebSocket')
    websocketStore.disconnect()
  }
}


// Initialize application data (only once per session)
async function initializeAppData() {
  try {
    if (keycloakService.isAuthenticated.value && !isTenantRoute.value) {
      // Only fetch static data once per session
      if (!dataInitialized.value) {
        logger.debug('Initializing app data')
        // Fetch 'static' data
        await scopeStore.fetchScopes()
        await assetStore.fetchAssets()
        
        // Mark data as initialized
        dataInitialized.value = true
        logger.debug('App data initialized successfully')
      } else {
        logger.warn('App data already initialized, skipping fetch')
      }
      
      // Initialize WebSocket connection if not already connected
      if (websocketStore.status !== EConnectionStatus.Open) {
        await nextTick()
        await initializeWebSocket()
      }
    }
  } catch (error) {
    logger.error('Failed to initialize app data:', error)
  }
}

// Debounce function to prevent rapid multiple executions
function debounce(fn: Function, wait: number) {
  let timeout: number | null = null
  return function(...args: any[]) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => {
      fn(...args)
      timeout = null
    }, wait)
  }
}

// Debounced initialization
const debouncedInit = debounce(initializeAppData, 300)


// lifeCycle
onMounted(() => {
  logger.debug('mount')
  refresh()

  // If already authenticated when mounted, initialize data
  if (keycloakService.isAuthenticated.value) {
    initializeAppData()
  }
})

onBeforeUnmount(() => {
  disconnectWebSocket()
})

// watch
watch(
  () => keycloakService.isAuthenticated.value,
  (isAuthenticated) => {
    // Skip if state hasn't actually changed
    if (isAuthenticated === lastAuthState) {
      return
    }
    
    lastAuthState = isAuthenticated
    
    if (isAuthenticated) {
      logger.debug('Authentication state changed to authenticated')
      debouncedInit()
    } else {
      logger.debug('Authentication state changed to not authenticated')
      // Disconnect WebSocket when user logs out
      disconnectWebSocket()
      // Reset initialization state
      dataInitialized.value = false
      websocketInitialized.value = false
    }
  }
)

// Watch branch changes
watch(
  () => sessionStore.getCurrentBranch,
  (newBranch, oldBranch) => {
    // Skip if branch hasn't changed or is the same as last processed branch
    if (!newBranch || newBranch === oldBranch || newBranch === lastBranch) {
      return
    }
    
    lastBranch = newBranch
    
    // Only reconnect WebSocket if authenticated
    if (keycloakService.isAuthenticated.value) {
    logger.debug('Branch changed, reconnecting WebSocket')
      disconnectWebSocket()
      // Use nextTick to ensure state updates before reconnecting
      nextTick(() => {
        initializeWebSocket()
      })
    }
  }
)

// More efficient route change handling
watch(
  () => route.path,
  (newPath, oldPath) => {
    // Ignore hash/query changes or if paths are the same
    if (
      !newPath || 
      !oldPath || 
      newPath === oldPath || 
      newPath.split('?')[0] === oldPath.split('?')[0]
    ) {
      return
    }
    
    // Only for authenticated users on protected routes
    if (
      !isTenantRoute.value &&
      keycloakService.isAuthenticated.value
    ) {
      logger.debug('Path changed, ensuring data is available')
      
      // Only initialize data if not already done
      if (!dataInitialized.value) {
        debouncedInit()
      }
      // Ensure WebSocket is connected
      else if (websocketStore.status !== EConnectionStatus.Open && websocketInitialized.value) {
        logger.debug('Reconnecting WebSocket after route change')
        initializeWebSocket()
      }
    }
  }
)
</script>

<style scope>
.page-size {
  height: 100%;
  width: 100%;
}
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
  height: 100%;
}
.layout-header {
  max-height: fit-content;
  flex: 1;
}

/* Loading spinner styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary-color, #3498db);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
