<template>
 
  <Alert :icon="EIcon.Success" :color="EColor.Success">i'm alert </Alert>

  <div>
    <h1>{{ $t('message.hello') }}</h1>
  </div>
<Button  @click="toggleTheme"> Change Theme</Button>
  <select @change="changeLanguage" v-model="currentLocale">
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="th">Thai</option>
  </select>


  <Button :color="EColor.Success " :outline="true"
    >i'm a button</Button
  >
  <InputCard></InputCard>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import logo from '@/components/icons/logo.vue'
import Alert from '@/components/alert/Alert.vue'
import { EIcon } from '@/enums/EIcon'
import { EColor } from '@/enums/EColor'
import Button from './components/buttons/Button.vue'
import InputCard from './components/cards/InputCard.vue'
const currentLocale = ref('en')
const { locale } = useI18n()
let isDark = false
function toggleTheme() {
  isDark = !isDark
  if (isDark) {
    console.log('dark')
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    console.log('light')

    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
}

function changeLanguage() {
  locale.value = currentLocale.value
}
onMounted(() => {
  document.body.classList.add('light-theme')
})
</script>

<style></style>
