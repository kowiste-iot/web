<template>
  <Container>
    <div class="row min-vh-100 align-items-center justify-content-center">
      <div class="col-auto">
        <Card class="add-tenant">
          <Row>
            <Col
              :breakpoint="EBreakpoint.MD"
              :size="tenants.length > 0 ? 6 : 12"
            >
              <Flex class="add-tenant-header">
                <h5>
                  {{ tenants.length ? 'Add New Tenant' : 'Enter Tenant' }}
                </h5>
              </Flex>
              <Flex column>
                <label>Tenant </label>
                <Input
                  :placeholder="$t('tenant.inputName')"
                  type="text"
                  v-model="newTenant.name"
                />
              </Flex>
              <Flex column>
                <label>Email </label>
                <Input
                  placeholder="your email"
                  type="email"
                  @enter="addNewTenant"
                  v-model="newTenant.email"
                />
              </Flex>
              <div class="p-inputgroup">
                <Flex reverse :gap="3">
                  <Button :color="EColor.Warning" @click="addNewTenant">
                    Login
                  </Button>
                  <Button :color="EColor.Tertiary" @click="goOnboard">
                    Register
                  </Button>
                </Flex>
              </div>
              <small class="p-error block mt-2" v-if="errorMessage">{{
                errorMessage
              }}</small>
            </Col>
            <Col
              v-if="tenants.length && tenants.length > 0"
              :breakpoint="EBreakpoint.MD"
              :size="6"
            >
              <h5>or select tenant</h5>
              <div
                v-for="tenant in tenants"
                :key="tenant.id"
                class="tenant-item"
              >
                <div class="d-flex gap-1">
                  <div
                    class="flex-fill text-center border py-3"
                    :class="EColor.MenuBg"
                    role="button"
                    @click="selectTenant(tenant.id)"
                  >
                    {{ tenant.name }}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  </Container>
  <Modal v-if="showModal">
    <Col :breakpoint="EBreakpoint.SM" :size="10">
      <Card>
        <Row>
          <Col :breakpoint="EBreakpoint.MD" :size="6"> </Col>
          <Col :breakpoint="EBreakpoint.MD" :size="6" class="side-logo">
            <Logo
              mainLogo="var(--color-icon-white)"
              topLogo="var(--color-icon-white)"
          /></Col>
        </Row>
      </Card>
    </Col>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/features/tenant/stores/tenant'
import { keycloakService } from '@/plugins/security/KeycloakService'
import Input from '@/components/form/Input.vue'
import Button from '@/components/buttons/Button.vue'
import { EColor } from '@/features/shared/enum/EColor'
import Card from '@/components/cards/Card.vue'
import Flex from '@/components/layout/Flex.vue'
import Container from '@/components/layout/Container.vue'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import { EBreakpoint } from '@/components/layout/grid/model'
import Modal from '@/components/layout/Modal.vue'
import Logo from '@/components/icons/Logo.vue'
import logger from '@/utils/log/logger'

const router = useRouter()
const tenantStore = useTenantStore()
const showModal = ref<boolean>(false)
const newTenant = ref<TenantLogin>({ name: '', email: '' })
const errorMessage = ref('')
interface TenantLogin {
  name: string
  email: string
}
const tenants = computed(() => tenantStore.getAllTenants)

onMounted(() => {
  tenantStore.loadTenants()
})

async function addNewTenant() {
  if (
    newTenant.value &&
    newTenant.value.email != '' &&
    newTenant.value.name != ''
  ) {
    const result = tenantStore.addTenant(
      newTenant.value.name,
      newTenant.value.name,
      newTenant.value.email // Pass the email to store with the tenant
    )
    if (result.success) {
      try {
        // No need to set the email separately, it's stored with the tenant
        await keycloakService.updateRealm(newTenant.value.name)
        newTenant.value.name = ''
        newTenant.value.email = ''
        errorMessage.value = ''
        await router.push('/')
      } catch (error) {
        logger.error('Failed to initialize Keycloak:', error)
        errorMessage.value = 'Failed to initialize tenant authentication'
      }
    } else {
      errorMessage.value = result.error || 'Failed to add tenant'
    }
  }
}

async function selectTenant(tenantId: string) {
  try {
    await tenantStore.setCurrentTenant(tenantId)
    // Initialize Keycloak with selected tenant
    await keycloakService.updateRealm(tenantId)
    await router.push('/')
  } catch (error) {
    logger.error('Failed to initialize tenant:', error)
    errorMessage.value = 'Failed to initialize tenant authentication'
  }
}
function goOnboard() {
  showModal.value = true
  //router.push('/onboard')
}
</script>

<style scoped>
.add-tenant {
  padding: var(--size-100) var(--size-300) var(--size-300) var(--size-300);
}
.add-tenant-header {
  padding-bottom: var(--size-300);
}
.side-logo {
  padding: 100px;
  background-color: red;
}
</style>
