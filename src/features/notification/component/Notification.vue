``
<template>
  <div class="position-relative over">
    <div class="px-2" role="button" @click="toggleVisibility">
      <FIcon
        class="pe-3"
        :icon="EIcon.Notification"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
    <div
      v-if="isVisible"
      class="position-absolute top-100 end-50 border rounded bg-white py-2 px-3"
      style="min-width: 10rem; width: 20rem"
      @mouseleave="toggleVisibility"
    >
      <div v-if="notifications.length < 1">No Notifications</div>
      <div v-else>
        <div v-for="(element, index) in notifications" class="">
          <div
            class="btn d-flex"
            :class="
              isHover[index]
                ? 'bg-secondary text-black opacity-50'
                : 'btn-ligth'
            "
            @click="onClick(index)"
            @mouseover="isHover[index] = true"
            @mouseleave="isHover[index] = false"
          >
            <div
              :class="`bg-${element.severityColor()} rounded-start rounded-top p-1 me-2`"
            />
            <FIcon class="pt-1" :icon="element.icon" />
            <div class="ms-4 flex-fill">{{ element.msg }}</div>
            <FIcon class="pt-1 text-danger" :icon="EIcon.Close" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import

// components import

// model imports
import { EIcon } from '@/features/shared/enum/EIcon'
import { ENotificationSeverity } from '@/features/notification/domain/ENotificationSeverity'
import { Property } from '@/features/shared/domain/property'
import { Notification } from '@/features/shared/domain/notification'

// other imports
// props
interface Props {
  data?: Property[]
  onClick?: Function
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  onClick: function () {},
})
// data
const isVisible = ref(false)
const isHover = ref({} as Record<string, boolean>)
// storage calls

// computed
let notifications = new Array<Notification>()
notifications.push(
  new Notification({
    id: '342',
    icon: EIcon.Death,
    msg: 'New data available',
    severity: ENotificationSeverity.High,
  })
)

// methods
function toggleVisibility() {
  isVisible.value = !isVisible.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
