<template>
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
      <Column header="Макс.балл">
        <template #body="slotProps">
          {{ slotProps.data.statistics?.maxPrimaryScore }}
        </template>
      </Column>
      <Column header="Мин.балл">
        <template #body="slotProps">
          {{ slotProps.data.statistics?.minPrimaryScore }}
        </template>
      </Column>
      <Column header="Ср.балл">
        <template #body="slotProps">
          {{ slotProps.data.statistics?.averagePrimaryScore }}
        </template>
      </Column>
      <Column header="Мин.проходной балл">
        <template #body="slotProps">
          {{ slotProps.data.statistics?.passedMinPrimaryScore }}
        </template>
      </Column>
      <Column header="Ср.проходной балл">
        <template #body="slotProps">
          {{ slotProps.data.statistics?.passedAveragePrimaryScore }}
        </template>
      </Column>
      <Column header="Квота">
        <template #body="slotProps">
          {{ slotProps.data.statistics?.quota }}
        </template>
      </Column>
      <Column header="Кол-во абитуриентов">
        <template #body="slotProps">
          {{ slotProps.data.statistics?.applicationsCount }}
        </template>
      </Column>
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
