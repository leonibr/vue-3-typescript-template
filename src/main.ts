import 'normalize.css'
import './styles/index.scss'
import ElementPlus from 'element-plus'
import { createApp, type Directive } from 'vue'
import { createPinia } from 'pinia'
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon'
import '@yzfe/svgicon/lib/svgicon.css'
import App from './App.vue'
import router from '@/router'
import '@/permission'
import * as directives from '@/directives'
import { useAppStore } from './stores/app-store'
import i18n from './lang'
import globalErrorHandler from './utils/error-log'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

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

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive<any, any> })[key])
})

app.use(router)
app.use(i18n)

app.config.errorHandler = globalErrorHandler()

app.mount('#app')
