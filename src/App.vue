<template>
<h1>Kowiste</h1>
<h1>{{ $t('message.hello') }}</h1>
<select @change="changeLanguage($event)" v-model="currentLocale">
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="th">Thai</option>
    </select>
  <div id="app">
    <button class="btn btn-warning" @click="toggleTheme">Change Theme</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

let isDark= false
function   toggleTheme() {
      isDark = !isDark;
      if (isDark) {
        console.log('dark');
        // document.body.setAttribute('theme','light')
        document.body.setAttribute('theme','dark')
      } else {
        console.log('light');
        document.body.setAttribute('theme','light')
        // document.body.setAttribute('theme','light')
        // document.body.classList.add('dark-theme')
        // document.body.classList.remove('light-theme')
      }
    }
    
function changeLanguage(event){ 
  this.$i18n.locale = event.target.value;

}
onMounted(()=>{
  document.body.setAttribute('theme','light');
})

</script>

<style>

</style>

