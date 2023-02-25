import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import './styles.css'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button';

const app = createApp(App)

app.use(PrimeVue)
app.component('Button', Button)

app.use(createPinia())

app.mount('#app')
