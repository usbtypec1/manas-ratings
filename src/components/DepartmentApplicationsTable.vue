<template>
  <DataTable :value="applications">

    <template #header>
      <h2>{{ facultyName }}</h2>
      <h3>{{ departmentName }}</h3>
    </template>

    <Column field="rating" header="Рейтинг"/>

    <Column field="applicantId" header="Рег.номер"/>

    <Column field="applicantId" header="Фото">
      <template #body="slotProps">
        <Image
          :src="buildApplicantPhotoUrl(slotProps.data.applicantId)"
          width="100"
          preview
        />
      </template>
    </Column>

    <Column field="primaryScore" header="Осн.баллы"/>

    <Column field="secondaryScore" header="ОРТ/Англ"/>

    <Column field="createdAt" header="Дата подачи"/>

    <Column field="isPassed" header="Прошёл">
      <template #body="slotProps">
        <span v-if="slotProps.data.isPassed">Да</span>
        <span v-else>Нет</span>
      </template>
    </Column>

  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Image from 'primevue/image'
import { buildApplicantPhotoUrl } from '../services/photos.js'

defineProps({
  facultyName: {
    type: String,
    required: true,
  },
  departmentName: {
    type: String,
    required: true,
  },
  applications: {
    type: Array,
    required: true,
  },
})
</script>
