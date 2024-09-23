<template>
  <div class="body-bg">
    <logo style="height: 20px" />
    <h1 class="bg-success">Kowiste</h1>
  </div>
  <Alert :icon="EIcon.Check" :color="EColor.Success">i'm alert </Alert>
  <Alert :icon="EIcon.Xmark" :color="EColor.Danger">i'm alert </Alert>
  
  <div>
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

  <Button :color="EColor.Success"
    >i'm a button and i can be as big as i can</Button
  >
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import logo from "@/components/icons/logo.vue";
import Alert from "@/components/alert/alert.vue";
import { EIcon } from "@/enums/EIcon";
import { EColor } from "@/enums/EColor";
import Button from "./components/buttons/button.vue";
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

<style></style>
