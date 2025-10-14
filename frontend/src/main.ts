import './assets/main.css'


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { provideTheme, ThemeKey } from './composables/useTheme'
import './plugins/axios'



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide(ThemeKey, provideTheme())

app.mount('#app')
