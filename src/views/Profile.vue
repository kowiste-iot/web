<template>
  <div>
    <Card class="col-md-12" headerText="User Profile" showHeader>
  <div class="row align-items-center p-2">
    <label class="col-3 text-end fw-bold">Name</label>
    <div class="col-6">
      <input type="text" readonly class="form-control-plaintext" :value="userStore._user?.name" />
    </div>
  </div>
  <div class="row align-items-center p-2">
    <label class="col-3 text-end fw-bold">Surname</label>
    <div class="col-6">
      <input type="text"  readonly class="form-control-plaintext" :value="userStore._user?.surname" />
    </div>
  </div>
  <div class="row align-items-center p-2">
    <label class="col-3 text-end fw-bold">Username</label>
    <div class="col-6">
      <input type="text" readonly class="form-control-plaintext" :value="userStore._user?.username"  />
    </div>
  </div>
  <div class="row align-items-center p-2">
    <label class="col-3 text-end fw-bold">Email</label>
    <div class="col-6">
      <input type="email"  readonly class="form-control-plaintext" :value="userStore._user?.email" />
    </div>
  </div>
  <div class="row align-items-center p-2">
    <label class="col-3 text-end fw-bold">Phone Number</label>
    <div class="col-6">
      <input type="text" readonly class="form-control-plaintext" :value="userStore._user?.phoneNumber" />
    </div>
  </div>
  <div class="row align-items-center p-2">
    <label class="col-3 text-end fw-bold">Role</label>
    <div class="col-6">
      <input type="text" readonly class="form-control-plaintext" :value="userStore._user?.role" />
    </div>
  </div>
</Card>

  </div>
</template>

<script setup lang="ts">
// imports
import { ref, onMounted } from 'vue';

// stores import
import { useI18n } from 'vue-i18n';
import { useBreadCrumb } from '@/stores/gui/breadcrumb';
import { useUser } from '@/stores/gui/user';

// components import
import Card from '@/components/cards/Card.vue';
import DropDown from '@/components/form/DropDown.vue';

// model imports

// other imports
// props

// data
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
];
const currentLocale = ref(languageOpt[0]);

// storage calls
const { locale } = useI18n();
const storeCrumb = useBreadCrumb();
const userStore = useUser();

storeCrumb.reset();
// computed
onMounted(() => {
  storeCrumb.reset();
  userStore.loadMockUser(); // This uses the loadMockUser method we added earlier
});
// methods

function changeLanguage() {
  locale.value = currentLocale.value.value;
}
// lifeCycle

// watch
</script>

<style scoped></style>
