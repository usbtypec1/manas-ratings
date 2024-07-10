<template>
  <div>
    <RouterLink :to="{ name: 'departments' }">
      <Button label="Назад" severity="info" style="margin-right: 0.5rem"/>
    </RouterLink>
    <Button :loading="isLoading" label="Обновить" @click="loadDepartmentRatings" style="margin-left: 0.5rem"/>
  </div>

  <div v-if="!isLoading">
    <p>Минимальный балл: {{ ratingsStatistics.minExamsScore }}</p>
    <p>Максимальный балл: {{ ratingsStatistics.maxExamsScore }}</p>
    <p>Общий средний балл : {{ ratingsStatistics.averageExamsScore }}</p>

    <template v-if="ratingsStatistics.applicantsCount > departmentRatings.quota">
      <p>Минимальный проходной балл: {{ ratingsStatistics.passedMinExamsScore }}</p>
      <p>Средний балл среди тех кто прошёл: {{ ratingsStatistics.passedMinExamsScore }}</p>
    </template>

    <p>Квота: {{ departmentRatings.quota }}</p>
    <p>Подалось абитуриентов: {{ ratingsStatistics.applicantsCount }}</p>

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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Image from 'primevue/image'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'

const computeAverage = (numbers) => {
  const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  return Math.round((average + Number.EPSILON) * 100) / 100
}


const ratingsStatistics = computed(() => {
  const { ratings = [] } = departmentRatings.value

  const passedApplicants = ratings.filter(({ is_passed }) => is_passed)

  const applicantsCount = ratings.length

  const allExamScores = ratings.map(rating => rating.exams_score)
  const passedExamScores = passedApplicants.map(rating => rating.exams_score)

  const minExamsScore = Math.min(...allExamScores)
  const maxExamsScore = Math.max(...allExamScores)
  const averageExamsScore = computeAverage(allExamScores)

  const passedMinExamsScore = Math.min(...passedExamScores)
  const passedAverageExamsScore = computeAverage(passedExamScores)

  return {
    applicantsCount,
    minExamsScore,
    maxExamsScore,
    averageExamsScore,
    passedMinExamsScore,
    passedAverageExamsScore,
  }
})

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
