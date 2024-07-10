<template>
  <div v-for="{ id, name } in departments" :key="id">
    <RouterLink :to="{ name: 'department', params: { id }}">
      <Button severity="secondary" :label="name" style="margin-bottom: 1rem" />
    </RouterLink>
  </div>
</template>

<script setup>
import departments from '../departments.json'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
</script>
