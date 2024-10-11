import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'
import VueGoodTablePlugin from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import Vue3Toastify from 'vue3-toastify'; // Pas besoin de type ici
import 'vue3-toastify/dist/index.css'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)
app.use(VueGoodTablePlugin);
app.use(Vue3Toastify);

// Mount vue app
app.mount('#app')
