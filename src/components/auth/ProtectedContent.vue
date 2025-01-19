<template>
  <template v-if="hasAccess">
    <slot></slot>
  </template>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/plugins/security/store'

interface Props {
  roles: string[]
}

const props = defineProps<Props>()
const store = useAuthStore()
const hasAccess = computed(
  () => true 
  //store.hasAnyRole(props.roles)
)
</script>
