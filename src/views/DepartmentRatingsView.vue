<template>
  <div>
    <RouterLink :to="{ name: 'departments' }">
      <Button label="Назад" severity="info" style="margin-right: 0.5rem"/>
    </RouterLink>
    <Button :loading="isLoading" label="Обновить" @click="loadDepartmentRatings" style="margin-left: 0.5rem"/>
  </div>
  <DataTable v-if="!isLoading" :value="departmentRatings.ratings">
    <template #header>
      <h2>{{ departmentRatings.faculty_name }}</h2>
      <h3>{{ departmentRatings.name }}</h3>
    </template>
    <Column field="rating" header="Рейтинг"/>
    <Column field="applicant_id" header="Рег.номер"/>
    <Column field="applicant_id" header="Фото">
      <template #body="slotProps">
        <Image :src="buildPhotoUrl(slotProps.data.applicant_id)" width="100" preview/>
      </template>
    </Column>
    <Column field="exams_score" header="Осн.баллы"/>
    <Column field="additional_score" header="ОРТ/Англ"/>
    <Column field="applied_at" header="Дата подачи"/>
    <Column field="is_passed" header="Прошёл">
      <template #body="slotProps">
        <span v-if="slotProps.data.is_passed">Да</span>
        <span v-else>Нет</span>
      </template>
    </Column>
  </DataTable>
  <ProgressSpinner style="margin-top: 2rem" v-else/>

</template>

<script setup>
import Button from 'primevue/button'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Image from 'primevue/image'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'

const buildPhotoUrl = applicantId => `https://abiturient.manas.edu.kg/page/uploads/photo/${applicantId}.jpg`

const route = useRoute()

const isLoading = ref(false)
const departmentRatings = ref({})

const { id: departmentId } = route.params

const loadDepartmentRatings = () => {
  const url = `https://manas-admissions-api.vercel.app/departments/${departmentId}`
  isLoading.value = true
  fetch(url)
    .then(response => response.json())
    .then(responseData => {
      departmentRatings.value = responseData
      isLoading.value = false
    })
}

onMounted(loadDepartmentRatings)
</script>
