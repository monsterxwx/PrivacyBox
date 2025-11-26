import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import { setupPlugins } from './plugins'
import 'virtual:uno.css'
import './style/index.scss'

const app = createApp(App)

setupPlugins(app)

app.use(router)

app.mount('#app')
