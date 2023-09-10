<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import ResizeMixin from '@/components/Charts/mixins/resize'
import * as echarts from 'echarts'
import { type PropType, defineComponent, watch, reactive } from 'vue'

export interface ILineChartData {
  expectedData: number[]
  actualData: number[]
}

export default defineComponent({
  name: 'LineChart',
  mixins: [ResizeMixin],
  props: {
    chartData: {
      type: Object as PropType<ILineChartData>,
      required: true
    },
    className: {
      default: 'chart'
    },
    width: {
      default: '100%'
    },
    height: {
      default: '350px'
    }
  },
  setup(props) {
    return {
      vmChartData: reactive(props.chartData)
    }
  },
  mounted() {
    watch(this.vmChartData, this.onChartDataChange, { deep: true })
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    onChartDataChange(value: ILineChartData) {
      this.setOptions(value)
    },
    setOptions(chartData: ILineChartData) {
      if (this.chart) {
        this.chart.setOption({
          xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: 8
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: ['expected', 'actual']
          },
          series: [
            {
              name: 'expected',
              itemStyle: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              },
              smooth: true,
              type: 'line',
              data: chartData.expectedData,
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            },
            {
              name: 'actual',
              smooth: true,
              type: 'line',
              itemStyle: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              },
              data: chartData.actualData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }
          ]
        })
      }
    },
    initChart() {
      this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
      this.setOptions(this.chartData)
    }
  },
  beforeUnmount() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
})
</script>
