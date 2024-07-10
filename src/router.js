import { createRouter, createWebHistory } from 'vue-router'
import DepartmentsView from './views/DepartmentsView.vue'
import DepartmentRatingsView from './views/DepartmentRatingsView.vue'


export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DepartmentsView,
      name: 'departments',
    },
    {
      path: '/departments/:id',
      component: DepartmentRatingsView,
      name: 'department',
    },
  ],
})
