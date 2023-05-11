import { createApp } from 'vue'
import Toast from 'primevue/toast';
import App from './App.vue'
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import 'primeicons/primeicons.css';

createApp(App).use(Toast).use(PrimeVue).mount('#app')
