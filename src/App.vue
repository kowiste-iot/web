<template>
  <div class="body-bg">
    <logo style="height: 20px" />
    <h1 class="bg-success">Kowiste</h1>
  </div>
  <Alert :icon="EIcon.User" :color="EColor.Primary">gpwr'bowjr[buhw[rhbw[o'jvipdhwrfg[q9peuj4g]0pjwr[oghe[gjw]]]]]]]]]] </Alert>
  <div>
    <div
      class="alert-left"
      :style="{ backgroundColor: '#000', width: '60px', height: '60px' }"
    ></div>
    <h1>{{ $t("message.hello") }}</h1>
  </div>

  <select @change="changeLanguage" v-model="currentLocale">
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="th">Thai</option>
  </select>
  <div>
    <button class="btn btn-danger" @click="toggleTheme">Change Theme</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import logo from "@/components/icons/logo.vue";
import Alert from "@/components/alert/alert.vue";
import { EIcon } from "@/enums/EIcon";
import { EColor } from "@/enums/EColor";
const currentLocale = ref("en");
const { locale } = useI18n();
let isDark = false;
function toggleTheme() {
  isDark = !isDark;
  if (isDark) {
    console.log("dark");
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  } else {
    console.log("light");

    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  }
}

function changeLanguage() {
  locale.value = currentLocale.value;
}
onMounted(() => {
  document.body.classList.add("light-theme");
});
</script>

<style>
.alert-left {
  width: 60px; /* Left part of the alert is 60px */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aqua;
}
.alert {
  min-height: 50px; /* Set a minimum height if needed */
}
</style>
