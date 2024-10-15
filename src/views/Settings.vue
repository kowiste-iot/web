<template>
  <div>
    <InputCard class="col-md-12" headerText="User Settings">
      <div class="row">
        <label class="col-md-4"> {{ $t('setting.theme') }} </label>

        <div class="col-md-8 form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            @change="userStore.changeTheme()"
          />
        </div>
      </div>
      <div class="row">
        <label class="col-md-4"> {{ $t('setting.language') }} </label>
        <div class="col-md-8">
          <select @change="changeLanguage" v-model="currentLocale">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="th">Thai</option>
          </select>
        </div>
      </div>
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

// model imports

// other imports
// props

// data
const currentLocale = ref('en')

// storage calls
const { locale } = useI18n()
const storeCrumb = useBreadCrumb()
const userStore = useUser()

storeCrumb.reset()
// computed
// methods

function changeLanguage() {
  locale.value = currentLocale.value
}
// lifeCycle

// watch
</script>

<style scoped></style>
