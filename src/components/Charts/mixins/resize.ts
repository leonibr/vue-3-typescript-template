import { type ECharts } from 'echarts'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ResizeMixin',
  setup() {
    let chart!: ECharts | null
    let sidebarElm!: Element | null
    return {
      chart,
      sidebarElm
    }
  },
  mounted() {
    this.initResizeEvent()
    this.initSidebarResizeEvent()
  },
  beforeUnmount() {
    this.destroyResizeEvent()
    this.destroySidebarResizeEvent()
  },
  activated() {
    this.initResizeEvent()
    this.initSidebarResizeEvent()
  },
  deactivated() {
    this.destroyResizeEvent()
    this.destroySidebarResizeEvent()
  },
  methods: {
    chartResizeHandler() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    sidebarResizeHandler(e: TransitionEvent) {
      if (e.propertyName === 'width') {
        this.chartResizeHandler()
      }
    },
    initResizeEvent() {
      if (this.chartResizeHandler) {
        window.addEventListener('resize', this.chartResizeHandler)
      }
    },
    destroyResizeEvent() {
      if (this.chartResizeHandler) {
        window.removeEventListener('resize', this.chartResizeHandler)
      }
    },
    initSidebarResizeEvent() {
      this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      if (this.sidebarElm) {
        this.sidebarElm.addEventListener(
          'transitionend',
          this.sidebarResizeHandler as EventListener
        )
      }
    },
    destroySidebarResizeEvent() {
      if (this.sidebarElm) {
        this.sidebarElm.removeEventListener(
          'transitionend',
          this.sidebarResizeHandler as EventListener
        )
      }
    }
  }
})
