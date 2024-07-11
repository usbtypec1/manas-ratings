<template>
  <h2>Улучшенный (неофициальный) рейтинг абитуриентов университета Манас</h2>
  <h3>Наш чат в Telegram - <a href="https://t.me/studmanas" target="_blank">@studmanas</a></h3>
  <h3>Разработчик - <a href="https://github.com/usbtypec1" target="_blank">@usbtypec</a></h3>

  <p v-if="facultiesDepartmentsStatistics">Чтобы просмотреть баллы конкретного направления, нажмите на название</p>
  <DepartmentsTable
    v-if="facultiesDepartmentsStatistics"
    :faculties-departments-statistics="facultiesDepartmentsStatistics"
  />
  <ProgressSpinner v-if="isLoading && !facultiesDepartmentsStatistics"/>

</template>

<script setup>
import { getAllDepartmentsRatings } from '../services/api/all-departments-ratings.js'
import { onMounted, ref } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useDepartmentsStatisticsStore } from '../stores/departmentsStatistics.js'
import { useTimeoutFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import DepartmentsTable from '../components/DepartmentsTable.vue'

const isError = ref(false)
const isLoading = ref(false)

const departmentsStatisticsStore = useDepartmentsStatisticsStore()
const {
  facultiesDepartmentsStatistics,
  departmentsRatings,
} = storeToRefs(departmentsStatisticsStore)

const { setDepartmentsRatings } = departmentsStatisticsStore

const loadDepartments = async () => {
  isLoading.value = true
  try {
    const data = await getAllDepartmentsRatings()
    setDepartmentsRatings?.(data)

  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const { start } = useTimeoutFn(async () => {
  await loadDepartments()
  start?.()
}, 60000)

onMounted(async () => {
  if (!departmentsRatings.value) {
    await loadDepartments()
    start?.()
  }
})
</script>
