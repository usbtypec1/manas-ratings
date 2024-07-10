<template>
  <p>Минимальный балл: {{ applicationStatistics.minPrimaryScore }}</p>
  <p>Максимальный балл: {{ applicationStatistics.maxPrimaryScore }}</p>
  <p>Общий средний балл : {{ applicationStatistics.averagePrimaryScore }}</p>

  <template v-if="applicationStatistics.applicationsCount > quota">
    <p>Минимальный проходной балл: {{ applicationStatistics.minPrimaryScore }}</p>
    <p>Средний балл среди тех кто прошёл: {{ applicationStatistics.averagePrimaryScore }}</p>
  </template>

  <p>Квота: {{ quota }}</p>
  <p>Подалось абитуриентов: {{ applicationStatistics.applicationsCount }}</p>
</template>

<script setup>
import { computed } from 'vue'
import { computeApplicationsStatistics } from '../services/statistics.js'

const props = defineProps({
  applications: {
    type: Array,
    required: true,
  },
  quota: {
    type: Number,
    required: true,
  }
})

const applicationStatistics = computed(() => computeApplicationsStatistics(props.applications ?? []))
</script>
