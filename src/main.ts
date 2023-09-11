import './styles/index.scss'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon'
import '@yzfe/svgicon/lib/svgicon.css' //- replaced by custom theme
// import '@/assets/custom/svg-icon.css'
import App from './App.vue'
import router from '@/router'
import '@/permission'
import { useAppStore } from './stores/app-store'
import i18n from './lang'
import globalErrorHandler from './utils/error-log'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

const appStore = useAppStore()
app.use(ElementPlus, {
  size: appStore.size
})
app.use(VueSvgIconPlugin, {
  tagName: 'icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

app.use(router)
app.use(i18n)

app.config.errorHandler = globalErrorHandler()

app.mount('#app')
