<template>
  <h2>Улучшенный (неофициальный) рейтинг абитуриентов университета Манас</h2>
  <h3>Наш чат в Telegram - <a href="https://t.me/studmanas" target="_blank">@studmanas</a></h3>
  <h3>Разработчик - <a href="https://github.com/usbtypec1" target="_blank">@usbtypec</a></h3>
  <p v-if="facultiesDepartmentsStatistics">Чтобы просмотреть баллы конкретного направления, нажмите на название</p>
  <DataTable
    v-for="{ facultyName, departments } in facultiesDepartmentsStatistics"
    v-if="facultiesDepartmentsStatistics"
    :value="departments"
    striped-rows
    style="margin-bottom: 4rem"
  >
    <template #header>
      <h3>{{ facultyName }}</h3>
    </template>
    <Column header="Направление">
      <template #body="slotProps">
        <RouterLink :to="{ name: 'department', params: { id: slotProps.data.id } }">
          {{ slotProps.data.name }}
        </RouterLink>
      </template>
    </Column>
    <Column field="statistics.maxPrimaryScore" header="Макс.балл" sortable/>
    <Column field="statistics.minPrimaryScore" header="Мин.балл" sortable/>
    <Column field="statistics.averagePrimaryScore" header="Ср.балл" sortable/>
    <Column field="statistics.passedMinPrimaryScore" header="Мин.проходной балл" sortable/>
    <Column field="statistics.passedAveragePrimaryScore" header="Ср.проходной балл" sortable/>
    <Column field="statistics.quota" header="Квота" sortable/>
    <Column field="statistics.applicationsCount" header="Кол-во абитуриентов" sortable/>
  </DataTable>
  <ProgressSpinner v-if="isLoading && !facultiesDepartmentsStatistics"/>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { getAllDepartmentsRatings } from '../services/api/all-departments-ratings.js'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import { useDepartmentsStatisticsStore } from '../stores/departmentsStatistics.js'
import { useTimeoutFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

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
