import { DeviceType, useAppStore } from '@/stores/app-store'

import {
  defineComponent,
  computed,
  ref,
  reactive,
  watch,
  onBeforeUnmount,
  onMounted,
  toRefs
} from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'ResizeMixin',
  data() {
    const WIDTH = 992 // refer to Bootstrap's responsive design
    const appStore = useAppStore()

    const deviceRef = ref(appStore.device)
    const device = computed(() => deviceRef.value)
    const sidebarRef = reactive(appStore.sidebar)
    const sidebar = computed(() => ({ ...toRefs(sidebarRef) }))
    const clientRec = reactive(document.body.getBoundingClientRect())
    const isMobile = computed(() => {
      const rect = clientRec
      return rect.width - 1 < WIDTH
    })
    const route = useRoute()
    watch(route, () => {
      if (device.value === DeviceType.Mobile && sidebar.value.opened) {
        appStore.closeSideBar(false)
      }
    })

    function resizeHandler() {
      if (!document.hidden) {
        appStore.toggleDevice(isMobile.value ? DeviceType.Mobile : DeviceType.Desktop)
        if (isMobile.value) {
          appStore.closeSideBar(true)
        }
      }
    }
    window.addEventListener('resize', resizeHandler)
    onBeforeUnmount(() => window.removeEventListener('resize', resizeHandler))
    onMounted(() => {
      if (isMobile.value) {
        appStore.toggleDevice(DeviceType.Mobile)
        appStore.closeSideBar(true)
      }
    })
    return {
      appStore,
      device,
      sidebar,
      isMobile
    }
  }
})
