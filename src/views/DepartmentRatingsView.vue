<template>
  <div>
    <RouterLink :to="{ name: 'departments' }">
      <Button label="Назад" severity="info" style="margin-right: 0.5rem"/>
    </RouterLink>
    <Button
      :loading="isLoading"
      label="Обновить"
      @click="loadDepartmentRatings"
      style="margin-left: 0.5rem"
    />
  </div>

  <DepartmentApplicationsStatistics
    v-if="!isLoading"
    :quota="departmentRatings?.quota"
    :applications="departmentRatings?.applications"
  />

  <DepartmentApplicationsTable
    v-if="!isLoading && departmentRatings !== undefined"
    :applications="departmentRatings?.applications"
    :faculty-name="departmentRatings?.facultyName?.ru"
    :department-name="departmentRatings?.departmentName?.ru"
  />
  <ProgressSpinner style="margin-top: 2rem" v-if="isLoading"/>

</template>

<script setup>
import Button from 'primevue/button'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { getDepartmentRatings } from '../services/api'
import DepartmentApplicationsTable from '../components/DepartmentApplicationsTable.vue'
import DepartmentApplicationsStatistics from '../components/DepartmentApplicationsStatistics.vue'

const route = useRoute()

const isLoading = ref(false)
const isError = ref(false)
const departmentRatings = ref(undefined)

const { id: departmentId } = route.params

const loadDepartmentRatings = async () => {
  isLoading.value = true
  try {
    departmentRatings.value = await getDepartmentRatings(departmentId)
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDepartmentRatings)
</script>
