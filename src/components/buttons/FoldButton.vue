<template>
  <div class="expandable-button-container">
    <button
      class="btn d-flex"
      :class="
        (outline ? `btn-outline-${color}` : `btn-${color} `) +
        (small ? ' btn-sm' : '')
      "
      @click="toggleExpand"
    >
      <FIcon v-if="icon" class="far pe-2 pt-1" :icon="icon" />
      <slot name="button-text" />
    </button>

    <transition name="expand">
      <div
        v-if="isExpanded"
        class="expanded-content border rounded mt-2 p-3"
        :class="`border-${color}`"
      >
        <slot name="expanded-content" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EColor } from '@/features/shared/enum/EColor';
import { EIcon } from '@/features/shared/enum/EIcon';

interface Props {
  icon?: EIcon;
  color?: EColor;
  outline?: boolean;
  small?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: EIcon.Action,
  color: EColor.Primary,
  outline: false,
  small: false,
});

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.expanded-content {
  transition: all 0.3s ease;
}

.expand-enter-active,
.expand-leave-active {
  max-height: 300px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
