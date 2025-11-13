import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import router from './router'
import App from './App.vue'

// Styles
import './assets/styles/main.css'
import './assets/styles/markdown.css'

// Toast
import 'vue3-toastify/dist/index.css'

// Highlight.js theme
import 'highlight.js/styles/github-dark.css'

const app = createApp(App)

// Pinia
const pinia = createPinia()
app.use(pinia)

// Router
app.use(router)

// Head for SEO
const head = createHead()
app.use(head)

// Mount
app.mount('#app')
