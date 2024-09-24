<template>
  <Alert :icon="EIcon.Success" :color="EColor.Success">i'm alert </Alert>

  <div>
    <h1>{{ $t('message.hello') }}</h1>
  </div>
  <Button @click="toggleTheme"> Change Theme</Button>
  <select @change="changeLanguage" v-model="currentLocale">
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="th">Thai</option>
  </select>

  <Button :color="EColor.Success" :outline="true">i'm a button</Button>
  <InputCard headerText="Test Card" :icon="EIcon.Death">
    hello

    <template #footer>
      <Button :color="EColor.Success">Save</Button>
      <Button :color="EColor.Danger" :outline="true">Cancel</Button>
    </template>
  </InputCard>

  <InputCard>
    <template #header>
      <div>Test Card</div>
      <PropertyDot
        :data="test"
        :onClick="(id:number)=>console.log('press',id)"
      />
    </template>
    I have properties

    <template #footer>
      <Button :color="EColor.Success">Save</Button>
      <Button :color="EColor.Danger" :outline="true">Cancel</Button>
    </template>
  </InputCard>
</template>

<script setup lang="ts">
// imports
import { onMounted, ref } from 'vue'
// stores import
import { useI18n } from 'vue-i18n'
// components import
import Alert from '@/components/alert/Alert.vue'
import Button from '@/components/buttons/Button.vue'
import InputCard from '@/components/cards/Card.vue'
import logo from '@/components/icons/logo.vue'
import PropertyDot from '@/components/property/Property.vue'
// model imports
import { EIcon } from '@/enums/EIcon'
import { EColor } from '@/enums/EColor'
import { Property } from '@/model/property'
// other imports
// props
// data
const currentLocale = ref('en')
const test = new Array<Property>()
test.push({
  id: 1,
  icon: EIcon.Edit,
  name: 'Edit',
})
test.push({
  id: 2,
  icon: EIcon.Delete,
  name: 'Delete',
})
let isDark = false
// storage calls
const { locale } = useI18n()
// computed
// methods
function toggleTheme() {
  isDark = !isDark
  if (isDark) {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
}

function changeLanguage() {
  locale.value = currentLocale.value
}
// lifeCycle
onMounted(() => {
  document.body.classList.add('light-theme')
})
// watch
</script>

<style></style>
