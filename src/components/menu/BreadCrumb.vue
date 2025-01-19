<template>
  <div class="d-flex justify-content-start align-items-center">
    <div role="button" @click="goToHome">
      <FIcon
        class="pe-3"
        :icon="EIcon.Home"
        style="height: 1rem; width: 1rem"
      />
    </div>

    <div class="branch-selector">
      <template v-if="userStore.userInfo?.branches.length === 1">
        <span class="branch-label px-4">{{ currentBranchComputed }}</span>
      </template>
      <select
        v-else
        v-model="currentBranchComputed"
        class="form-select form-select-sm border-0 bg-transparent py-0"
        style="width: auto; min-width: 100px"
      >
        <option
          v-for="branch in userStore.userInfo?.branches"
          :key="branch"
          :value="branch"
        >
          {{ branch }}
        </option>
      </select>
    </div>

    /
    <div
      v-for="element in data.path"
      :key="element.path"
      class="ms-2"
      role="button"
      @click="goTo(element.path)"
    >
      {{ element.name }} /
    </div>
    <div class="ms-2">{{ data.page }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
import { useUserStore } from '@/features/user/stores/useUserStore'
import { EIcon } from '@/features/shared/enum/EIcon'

const router = useRouter()
const storeCrumb = useBreadCrumb()
const userStore = useUserStore()

const data = computed(() => {
  return storeCrumb.data
})
const currentBranchComputed = computed({
  get: () => userStore.getCurrentBranch,
  set: async (newValue: string) => {
    await userStore.updateSettings({
      ...userStore.userInfo!.settings,
      currentBranch: newValue,
    })
  }
})

function goToHome() {
  router.push('/')
}

function goTo(selected: string) {
  const foundIndex = data.value.path.findIndex((element) => {
    return element.path == selected
  })
  let path = ''
  for (let i = 0; i <= foundIndex; i++) {
    path += '/' + data.value.path[i].path
  }
  router.push(path)
}


</script>

<style scoped>
.branch-selector select {
  cursor: pointer;
  padding: 0.25rem 1.5rem 0.25rem 0.5rem;
}

.branch-selector select:focus {
  outline: none;
  box-shadow: none;
}

.branch-selector {
  position: relative;
  color: inherit;
}

.branch-label {
  color: inherit;
}
</style>
