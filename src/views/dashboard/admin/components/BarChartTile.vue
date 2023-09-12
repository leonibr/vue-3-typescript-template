<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import * as echarts from 'echarts'
import ResizeMixin from '@/components/Charts/mixins/resize'
import { defineComponent } from 'vue'

const animationDuration = 6000

export default defineComponent({
  name: 'BarChartTile',
  mixins: [ResizeMixin],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  created() {
    console.log({ name: 'BarChart-created', container: this.$el })
  },
  mounted() {
    console.log({ name: 'BarChart-mounted', container: this.$el })

    this.$nextTick(() => {
      console.log({ name: 'BarChart-mounted=tick', container: this.$el })
      this.initChart()
    })
  },
  beforeUnmount() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      console.log({ name: 'BarChart-InitChart' })
      this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            // barWidth: '60%',
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration
          },
          {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            // barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration
          },
          {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            // barWidth: '60%',
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration
          }
        ]
      })
    }
  }
})
</script>
