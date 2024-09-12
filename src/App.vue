<template>
<h1 class="bg-warning">Kowiste</h1>
<h1>{{ $t('message.hello') }}</h1>
<select @change="changeLanguage" v-model="currentLocale">
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="th">Thai</option>
    </select>
  <div >
    <button class="btn btn-warning" @click="toggleTheme">Change Theme</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted ,ref} from 'vue';
import { useI18n } from "vue-i18n"
const currentLocale=ref('en')
const {locale} = useI18n();
let isDark= false
function   toggleTheme() {
      isDark = !isDark;
      if (isDark) {
        console.log('dark');
       document.body.classList.add('dark-theme')
       document.body.classList.remove('light-theme')
      } else {
        console.log('light');
        
        document.body.classList.add('light-theme')
        document.body.classList.remove('dark-theme')
      }
    }
    
function changeLanguage(){ 
  locale.value = currentLocale.value
}
onMounted(()=>{
  document.body.classList.add('light-theme')
})

</script>

<style>

</style>

