<template>
  <div v-for="{ id, name } in departments.sort((a, b) => a.name.localeCompare(b.name))" :key="id">
    <RouterLink :to="{ name: 'department', params: { id }}">
      <Button link :label="name" style="margin-bottom: 1rem" />
    </RouterLink>
  </div>
</template>

<script setup>
import departments from '../departments.json'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
</script>
