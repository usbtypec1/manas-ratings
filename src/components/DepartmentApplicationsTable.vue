<template>
  <DataTable :value="applications">

    <template #header>
      <h2>{{ facultyName }}</h2>
      <h3>{{ departmentName }}</h3>
    </template>

    <Column field="rating" header="Рейтинг" sortable=""/>

    <Column field="applicantId" header="Рег.номер"/>

    <Column
      field="applicantId"
      header="Фото"
    >
      <template #body="slotProps">
        <Image
          v-show="isPhotosShown"
          :src="buildApplicantPhotoUrl(slotProps.data.applicantId)"
          width="100"
          preview
        />
        <Button
          v-show="!isPhotosShown"
          label="Показать"
          outlined
          rounded
          severity="help"
          @click="onShowPhotos"
        />
      </template>
    </Column>

    <Column field="primaryScore" header="Осн.баллы" sortable/>

    <Column field="secondaryScore" header="ОРТ/Англ" sortable/>

    <Column field="createdAt" header="Дата подачи" sortable>
      <template #body="slotProps">
        {{ new Date(slotProps.data.createdAt).toLocaleString() }}
      </template>
    </Column>

    <Column field="isPassed" header="Прошёл">
      <template #body="slotProps">
        <Tag v-if="slotProps.data.isPassed" severity="primary" value="Да"/>
        <Tag v-else severity="danger" value="Нет"/>
      </template>
    </Column>

  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Image from 'primevue/image'
import { buildApplicantPhotoUrl } from '../services/photos.js'
import Button from 'primevue/button'
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import Tag from 'primevue/tag'

const confirm = useConfirm()

const onShowPhotos = () => {
  confirm.require({
    header: 'Показать фотографии всех абитуриентов?',
    message: 'Внимание! Вы сами несёте ответственность за просмотр фотографий других абитуриентов. Продолжить?',
    accept: () => {
      isPhotosShown.value = true
    },
    acceptProps: {
      severity: 'danger',
      label: 'Да',
    },
    rejectProps: {
      severity: 'secondary',
      label: 'Нет',
    },
  })
}

const isPhotosShown = ref(false)

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
