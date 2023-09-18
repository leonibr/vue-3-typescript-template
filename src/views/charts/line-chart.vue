<template>
  <div class="chart-container">
    <line-chart height="100%" width="100%" />
  </div>
</template>

<script lang="ts">
import LineChart from '@/components/Charts/LineChart.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LineChartDemo',
  components: {
    LineChart
  }
})
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
