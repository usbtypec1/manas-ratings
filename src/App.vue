<script setup>
import { RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <ConfirmDialog style="max-width: 20rem"/>
  <RouterView />
</template>
