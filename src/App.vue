<template>
  <div class="d-flex align-items-stretch">
    <SideMenu />
    <div class="flex-fill container-md">
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
      <InputCard class="col-md-6" headerText="Test Card" :icon="EIcon.Death">
        hello
        <template #footer>
          <Button :color="EColor.Success">Save</Button>
          <Button :color="EColor.Danger" :outline="true">Cancel</Button>
        </template>
      </InputCard>
      <div class="d-flex p-5">
        <Spinner />
      </div>
      <InputCard class="col-md-6 my-4">
        <template #header>
          <div>Test Card</div>
          <PropertyDot
            :data="test"
            :onClick="(id:number)=>console.log('press',id)"
          />
        </template>
        <div class="row">
          <label class="col-md-2">Agent</label>
          <DropDown
            class="col-md-10"
            :icon="EIcon.Death"
            optionValue="name"
            filter
            optionLabel="name"
            groupLabel="brand"
            placeholder="select a city"
            :options="[
              {
                id: 2,
                name: 'Chanya',
                icon: EIcon.Cancel,
                country: 'thailand',
                brand: 'bmw',
              },
              {
                id: 3,
                name: 'Pablo',
                icon: EIcon.User,
                country: 'spain',
                brand: 'ferrari',
              },
              {
                id: 4,
                name: 'Namkhing',
                icon: EIcon.User,
                country: 'thailand',
                brand: 'tesla',
              },
              {
                id: 5,
                name: 'Pelayo',
                icon: EIcon.User,
                country: 'spain',
                brand: 'renault',
              },
            ]"
            v-model="drop"
          >
            <template #group="{ data }">
              Your car brand is : {{ data }} awesome
            </template>
            <template #option="{ data }">
              <FIcon :icon="data.icon" class="me-2" />
              {{ data.name }}
            </template>
          </DropDown>
        </div>

        <template #footer>
          <Button :color="EColor.Light">Save</Button>
          <Button :color="EColor.Dark" :outline="true">Cancel</Button>
        </template>
      </InputCard>

      <Input label="test" placeholder="test" type="file" />
      <div>Selected drop {{ drop }}</div>
    </div>
  </div>
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
import PropertyDot from '@/components/property/Property.vue'
import Input from '@/components/form/Input.vue'
import DropDown from '@/components/form/DropDown.vue'
import Spinner from '@/components/loading/Spinner.vue'
import MenuCard from './components/menu/SideMenu.vue'
// model imports
import { EIcon } from '@/enums/EIcon'
import { EColor } from '@/enums/EColor'
import { Property } from '@/model/property'
import SideMenu from './components/menu/SideMenu.vue'
// other imports
// props
// data
const currentLocale = ref('en')
const drop = ref()
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
test.push({
  id: 3,
  icon: EIcon.Info,
  name: 'Info',
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
