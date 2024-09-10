<template>
<h1>Kowiste</h1>
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

onMounted(()=>{
  document.body.setAttribute('theme','light');
})
</script>

<style>

</style>

