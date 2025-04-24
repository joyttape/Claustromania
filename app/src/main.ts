import './assets/bootstrap.min.css'
import './assets/style.css'
import './assets/tempusdominus-bootstrap-4.css'
import './assets/tempusdominus-bootstrap-4.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
