import './styles/index.scss'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon'
import '@yzfe/svgicon/lib/svgicon.css'
import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/app-store'
import i18n from './lang'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

const appStore = useAppStore()
app.use(ElementPlus, {
  size: appStore.size
})
app.use(VueSvgIconPlugin, {
  tagName: 'icon'
})

app.use(router)
app.use(i18n)

app.mount('#app')
