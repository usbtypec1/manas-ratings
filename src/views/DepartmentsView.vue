<template>
  <h2>Улучшенный (неофициальный) рейтинг абитуриентов университета Манас</h2>
  <h3>Наш чат в Telegram - <a href="https://t.me/studmanas" target="_blank">@studmanas</a></h3>
  <h3>Разработчик - <a href="https://github.com/usbtypec1" target="_blank">@usbtypec</a></h3>
  <DataTable
    v-for="{ facultyName, departments } in data"
    v-if="!isLoading"
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
  <ProgressSpinner v-if="isLoading"/>
</template>

<script setup>
import facultiesDepartments from '../facultiesDepartments.json'
import { RouterLink } from 'vue-router'
import { getAllDepartmentsRatings } from '../services/api/all-departments-ratings.js'
import { computed, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import { computeApplicationsStatistics } from '../services/statistics.js'

const departmentIdToStatistics = ref(undefined)
const isError = ref(false)
const isLoading = ref(false)

const data = computed(() => {
  return facultiesDepartments.map(({ facultyName, departments }) => {
    const departmentsWithStatistics = departments.map(department => {
      const statistics = departmentIdToStatistics.value?.[department.id]
      return {
        ...department,
        statistics,
      }
    })
    return {
      facultyName,
      departments: departmentsWithStatistics,
    }
  })
})

const loadDepartments = async () => {
  isLoading.value = true
  try {
    const data = await getAllDepartmentsRatings()

    const result = {}
    for (const departmentStatistics of data?.departmentsRatings) {
      result[departmentStatistics.departmentId] = {
        ...computeApplicationsStatistics(departmentStatistics.applications),
        quota: departmentStatistics.quota,
      }
    }
    departmentIdToStatistics.value = result

  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
onMounted(loadDepartments)
</script>
