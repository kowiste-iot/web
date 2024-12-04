<template>
  
  <div>
    <User />

    <div>
      <FoldButton :icon="EIcon.Add" :color="EColor.Danger" >
        <template #button-text> click me </template>
        <template #expanded-content> put anything you want here </template>
        
      </FoldButton>
    </div>
    <Button
      class="my-4"
      :color="EColor.Success"
      :outline="true"
      @click="goToAsset"
    >
      i'm a button
    </Button>
    <Button class="my-4" :color="EColor.Danger" loading>
      i'm a button
    </Button>
    <Switch onText="ON" offText="OFF" style="width: 5rem" />
    <Slider class="row my-5" :handles="2" v-model="t1" :max="100" :min="-30" />

    {{ 't1: ' + t1 }}
    <div class="d-flex">
      <!-- <Gauge
        style="height: 10rem; width: 10rem"
        :data="{}"
        :model-value="t1[0]"
        :border-color="'red'"
      />
      <Gauge
        style="height: 5rem; width: 5rem"
        :startAngle="270"
        :endAngle="90"
        :goodLimit="4"
        :warningLimit="50"
        :dangerLimit="80"
        :model-value="t1[1]"
      /> -->
    </div>

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
    <ColorPicker v-model="selectedColor" :size="40" />

    <Input label="test" placeholder="test" type="file" />
    <div>Selected drop {{ drop }}</div>
    <div>
      <CalenderHeatmap
        :data="contributionData"
        :year="2024"
        :month="3"
        :day="15"
      />
    </div>
  </div>
  <div>
    <Card showHeader showFooter>
      <template #header >header</template>
      jjiujjhklh
      <FoldButton :icon="EIcon.Add" :color="EColor.Danger" >
        <template #button-text> click me </template>
        <template #expanded-content> put anything you want here </template>
      </FoldButton>
      <template #footer>
        <FoldButton :icon="EIcon.Add" :color="EColor.Danger" >
        <template #button-text> click me </template>
        <template #expanded-content> put anything you want here </template>
      </FoldButton>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
// imports
import { onMounted, ref } from 'vue';
// stores import
import { useAlert } from '@/stores/gui/alert';
import { useBreadCrumb } from '@/stores/gui/breadcrumb';

// components import
import Button from '@/components/buttons/Button.vue';
import InputCard from '@/components/cards/Card.vue';
import Input from '@/components/form/Input.vue';
import DropDown from '@/components/form/DropDown.vue';
import Spinner from '@/components/loading/Spinner.vue';
import Slider from '@/components/slider/MultiSlider.vue';
import Gauge from '@/views/dashboard/card/Gauge.vue';
import Switch from '@/components/switch/Switch.vue';
import CalenderHeatmap from '@/components/heatmap/CalenderHeatmap.vue';
import ColorPicker from '@/components/color/ColorPicker.vue';
import FoldButton from '@/components/buttons/FoldButton.vue';
import Card from '@/components/cards/Card.vue';

// model imports
import { EIcon } from '@/enums/gui/EIcon';
import { EColor } from '@/enums/gui/EColor';

// other imports
// props

// data
const drop = ref();
const t1 = ref([]);

let isDark = false;
const selectedColor = ref('#ff0000');

const contributionData = ref([
  { date: '2024-01-01', count: 5 },
  { date: '2024-01-02', count: 2 },
  { date: '2024-01-03', count: 8 },
  { date: '2024-01-04', count: 3 },
  { date: '2024-01-05', count: 7 },
  // Add more dates to see the pattern
  { date: '2024-02-01', count: 4 },
  { date: '2024-02-02', count: 6 },
  { date: '2024-02-03', count: 2 },
  { date: '2024-03-01', count: 9 },
  { date: '2024-03-02', count: 3 },
  { date: '2024-04-01', count: 5 },
  { date: '2024-05-01', count: 7 },
  // Add some recent dates
  { date: new Date().toISOString().split('T')[0], count: 4 },
]);
// storage calls
const alertStore = useAlert();
const storeCrumb = useBreadCrumb();

storeCrumb.reset();
// computed
// methods
function goToAsset() {
  alertStore.setError('this is an error');
}
// lifeCycle
onMounted(() => {
  document.body.classList.add('light-theme');
});
// watch
</script>

<style scoped></style>
