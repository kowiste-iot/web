<template>
  <div>
    <InputCard class="col-md-12" headerText="User Profile">

    </InputCard>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import
import { useI18n } from 'vue-i18n'
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
import { useUser } from '@/stores/gui/user'

// components import
import InputCard from '@/components/cards/Card.vue'
import DropDown from '@/components/form/DropDown.vue'

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
const userStore = useUser()

storeCrumb.reset()
// computed
// methods

function changeLanguage() {
  locale.value = currentLocale.value.value
}
// lifeCycle

// watch
</script>

<style scoped></style>
