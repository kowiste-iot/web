<template>
  <div>
    <Card class="col-md-12" headerText="User Profile" showHeader>
      <div class="row align-items-center p-2">
        <label class="col-3 text-end fw-bold">Name</label>
        <div class="col-6">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.firstName"
          />
        </div>
      </div>
      <div class="row align-items-center p-2">
        <label class="col-3 text-end fw-bold">Surname</label>
        <div class="col-6">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.lastName"
          />
        </div>
      </div>
      <div class="row align-items-center p-2">
        <label class="col-3 text-end fw-bold">Username</label>
        <div class="col-6">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.email"
          />
        </div>
      </div>
      <div class="row align-items-center p-2">
        <label class="col-3 text-end fw-bold">Email</label>
        <div class="col-6">
          <input
            type="email"
            readonly
            class="form-control-plaintext"
            :value="user?.email"
          />
        </div>
      </div>

      <div class="row align-items-center p-2">
        <label id="my-button2" class="col-3 text-end fw-bold">Role</label>
        <div class="col-6">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.roles"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, onMounted } from 'vue'

// stores import
import { useI18n } from 'vue-i18n'
import { useBreadCrumb } from '@/features/shared/store/breadcrumb'

// components import
import Card from '@/components/cards/Card.vue'
import { useSessionStore } from '@/features/session/store/useSessionStore'

// model imports

// other imports
// props

// data
const languageOpt = [
  {
    id: 1,
    name: 'English',
    value: 'en',
    icon: 'fi fi-gb',
  },
  {
    id: 2,
    name: 'Spanish',
    value: 'es',
    icon: 'fi fi-es',
  },
  {
    id: 3,
    name: 'Thai',
    value: 'th',
    icon: 'fi fi-th',
  },
]
const currentLocale = ref(languageOpt[0])

// storage calls
const { locale } = useI18n()
const storeCrumb = useBreadCrumb()
const sessionStore = useSessionStore()
const user = sessionStore.userInfo
storeCrumb.reset()
// computed
onMounted(() => {
  storeCrumb.reset()
})
// methods

function changeLanguage() {
  locale.value = currentLocale.value.value
}
// lifeCycle

// watch
</script>

<style scoped></style>
