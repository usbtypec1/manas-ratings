<template>
    <DataTable
      v-for="{ facultyName, departments } in facultiesDepartments"
      :value="departments"
      striped-rows
      style="margin-bottom: 4rem"
    >
      <template #header>
        <h3>{{ facultyName }}</h3>
      </template>
      <Column field="name" header="Направление">
        <template #body="slotProps">
          <RouterLink :to="{ name: 'department', params: { id: slotProps.data.id } }">
            {{ slotProps.data.name }}
          </RouterLink>
        </template>
      </Column>
    </DataTable>
</template>

<script setup>
import facultiesDepartments from '../facultiesDepartments.json'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import { getAllDepartmentsRatings } from '../services/api/all-departments-ratings.js'
import { computed, onMounted, ref } from 'vue'
import Card from 'primevue/card'
import Fieldset from 'primevue/fieldset'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const departmentsStatistics = ref(undefined)
const isError = ref(false)


const loadDepartments = async () => {
  try {
    const data = await getAllDepartmentsRatings()
    departmentsStatistics.value = data?.departmentsRatings
  } catch (error) {
    isError.value = true
  }
}
onMounted(loadDepartments)
</script>
