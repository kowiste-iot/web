<template>
  <div class="calendar-heatmap col-12">
    <!-- Time Scale Selector -->
    <div class="scale-selector mb-4">
      <select v-model="selectedScale" class="scale-select">
        <option value="year">Year View</option>
        <option value="month">Month View</option>
        <option value="day">Day View (Hours)</option>
      </select>
    </div>

    <!-- Year View -->
    <template v-if="selectedScale === 'year'">
      <div class="container-fluid">
      
          <div class="col-12">
            <div class="months">
              <div v-for="month in 12" :key="month" class="month-label">
                {{
                  new Date(year, month - 1).toLocaleString('default', {
                    month: 'short',
                  })
                }}
              </div>
            </div>
          </div>

          <div class="days-labels">
            <div class="day-label">Mon</div>
            <div class="day-label">Wed</div>
            <div class="day-label">Fri</div>
          </div>
          <div class="calendar-grid">
            <div
              v-for="(week, weekIndex) in yearData"
              :key="weekIndex"
              class="week"
            >
              <div
                v-for="(day, dayIndex) in week"
                :key="dayIndex"
                class="day"
                :style="{ backgroundColor: getColor(day.count) }"
                :title="formatTooltip(day.count, day.date)"
              />
            </div>
          </div>
        
      </div>
    </template>

    <!-- Month View -->
    <template v-else-if="selectedScale === 'month'">
      <div class="month-grid">
        <div class="week-labels">
          <div v-for="day in 7" :key="day" class="week-label">
            {{
              new Date(2024, 0, day).toLocaleString('default', {
                weekday: 'short',
              })
            }}
          </div>
        </div>
        <div class="days-grid">
          <div
            v-for="(day, index) in monthData"
            :key="index"
            class="month-day"
            :style="{
              backgroundColor: getColor(day.count),
              gridColumn: day.dayOfWeek + 1,
            }"
            :title="formatTooltip(day.count, day.date)"
          >
            {{ day.date.getDate() }}
          </div>
        </div>
      </div>
    </template>

    <!-- Day View (Hours) -->
    <template v-else>
      <div class="day-view">
        <div class="hours-grid">
          <div
            v-for="(hour, index) in dayData"
            :key="index"
            class="hour-block"
            :style="{ backgroundColor: getColor(hour.count) }"
            :title="formatHourTooltip(hour.count, hour.hour)"
          >
            {{ hour.hour }}:00
          </div>
        </div>
      </div>
    </template>

    <div class="legend">
      <span>Less</span>
      <div
        v-for="(color, index) in colorScheme"
        :key="index"
        class="legend-item"
        :style="{ backgroundColor: color }"
      />
      <span>More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface ContributionData {
  date: string;
  count: number;
}

interface Props {
  data: ContributionData[];
  colorScheme?: string[];
  year?: number;
  month?: number;
  day?: number;
}

const props = withDefaults(defineProps<Props>(), {
  colorScheme: () => ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  year: () => new Date().getFullYear(),
  month: () => new Date().getMonth(),
  day: () => new Date().getDate(),
});

const selectedScale = ref('year');

// Helper function to get color based on count
const getColor = (count: number) => {
  const max = Math.max(...props.data.map((d) => d.count));
  if (count === 0) return props.colorScheme[0];
  const index = Math.ceil((count / max) * (props.colorScheme.length - 1));
  return props.colorScheme[Math.min(index, props.colorScheme.length - 1)];
};

// Format tooltips
const formatTooltip = (count: number, date: Date) =>
  `${count} contributions on ${date.toLocaleDateString()}`;

const formatHourTooltip = (count: number, hour: number) =>
  `${count} contributions at ${hour}:00`;

// Year View Data
const yearData = computed(() => {
  const result: { date: Date; count: number }[][] = [];
  const current = new Date(props.year, 0, 1);
  const dataMap = new Map(props.data.map((d) => [d.date, d.count]));

  current.setDate(current.getDate() - current.getDay());

  for (let week = 0; week < 53; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(current);
      const dateString = date.toISOString().split('T')[0];
      weekData.push({
        date,
        count: dataMap.get(dateString) || 0,
      });
      current.setDate(current.getDate() + 1);
    }
    result.push(weekData);
  }
  return result;
});

// Month View Data
const monthData = computed(() => {
  const result = [];
  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate();
  const dataMap = new Map(props.data.map((d) => [d.date, d.count]));

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(props.year, props.month, day);
    const dateString = date.toISOString().split('T')[0];
    result.push({
      date,
      count: dataMap.get(dateString) || 0,
      dayOfWeek: date.getDay(),
    });
  }
  return result;
});

// Day View Data (Hours)
const dayData = computed(() => {
  const result = [];
  const dataMap = new Map(props.data.map((d) => [d.date, d.count]));

  for (let hour = 0; hour < 24; hour++) {
    const date = new Date(props.year, props.month, props.day, hour);
    const dateString = date.toISOString().split('T')[0];
    result.push({
      hour,
      count: dataMap.get(dateString) || 0,
    });
  }
  return result;
});
</script>

<style scoped>
.calendar-heatmap {
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.scale-selector {
  margin-bottom: 1rem;
}

.scale-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* Year View Styles */
.calendar-grid {
  display: flex;
  gap: 3px;
}

.week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.day {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  cursor: pointer;
}

.months {
  display: flex;
  margin-left: 20px;
  margin-bottom: 5px;
}

.month-label {
  width: 60px;
  font-size: 12px;
  color: #666;
}

.days-labels {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 12px;
  color: #666;
  margin-right: 5px;
  float: left;
}

.day-label {
  height: 30px;
  line-height: 10px;
}

/* Month View Styles */
.month-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.week-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.month-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* Day View Styles */
.day-view {
  padding: 1rem;
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}

.hour-block {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* Legend Styles */
.legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 1rem;
  font-size: 12px;
  color: #666;
}

.legend-item {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
</style>
