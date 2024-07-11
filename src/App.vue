<script setup>
import { RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
import { useDepartmentsStatisticsStore } from './stores/departmentsStatistics.js'
import facultiesDepartments from './facultiesDepartments.json'


const departmentsStatisticsStore = useDepartmentsStatisticsStore()
departmentsStatisticsStore.setFacultiesDepartments(facultiesDepartments)
</script>

<template>
  <ConfirmDialog style="max-width: 20rem"/>
  <RouterView />
</template>
