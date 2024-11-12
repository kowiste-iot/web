<template>
  <template v-if="hasAccess">
    <slot></slot>
  </template>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useKeycloakStore } from '@/plugins/security/store'

interface Props {
  roles: string[]
}

const props = defineProps<Props>()
const store = useKeycloakStore()
const hasAccess = computed(() => store.hasAnyRole(props.roles))
</script>
