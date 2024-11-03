<template>
  <div>
    <InputCard class="col-md-12" :headerText="$t('setting.title')">
      <div class="row mb-3">
        <label class="col-md-4"> {{ $t('setting.theme') }} </label>

        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            @change="toggleTheme"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-md-4"> {{ $t('setting.language') }}</label>
        <DropDown
          class="col-md-8"
          optionValue="name"
          optionLabel="name"
          placeholder="select a language"
          :options="languageOpt"
          :onChange="changeLanguage"
          v-model="currentLocale"
        >
          <template #option="{ data }">
            <span :class="data.icon" class="me-2"></span>
            {{ data.name }}
          </template>
        </DropDown>
      </div>
    </InputCard>
  </div>
  <div>
    k
    <div class="row w-100">
      <div class="col-md-6">
        <Switch v-model="t" onColor="#4ADE80" offColor="#EF4444" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
import { EIcon } from '@/enums/gui/EIcon'

// stores import
import { useI18n } from 'vue-i18n'
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
import { useTheme } from '@/composable/useTheme'

// components import
import InputCard from '@/components/cards/Card.vue'
import DropDown from '@/components/form/DropDown.vue'
import Switch from '@/components/switch/Switch.vue'
// model imports

// other imports
// props

// data
let t = ref(false)
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
const { theme, toggleTheme } = useTheme()

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
