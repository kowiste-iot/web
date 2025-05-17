<template>
  <template v-if="hasAccess">
    <slot></slot>
  </template>
</template>
<script setup lang="ts">
import { keycloakService } from '@/plugins/security/KeycloakService';
import { computed } from 'vue'

interface Props {
  roles: string[]
}

const props = defineProps<Props>()
keycloakService.isAuthenticated
const hasAccess = computed(
  () => true 
  //store.hasAnyRole(props.roles)
)
</script>
