import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router.js'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(ConfirmationService);
app.mount('#app')
