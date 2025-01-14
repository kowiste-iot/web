<template>
  <div @click="() => (show = true)">Resource</div>
  <SideCard v-if="show" class="col-md-4">
    <InputCard class="h-100" headerText="Test Card" :icon="EIcon.Death">
      hello
      <template #footer>
        <Button :color="EColor.Success">Save</Button>
        <Button :color="EColor.Secondary" outline @click="() => (show = false)"
          >Cancel</Button
        >
      </template>
    </InputCard>
  </SideCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import

// components import
import InputCard from '@/components/cards/Card.vue'
import SideCard from '@/components/cards/SideCard.vue'
import Button from '@/components/buttons/Button.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
// other imports
// props
// data
const show = ref(false)

//service

// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
