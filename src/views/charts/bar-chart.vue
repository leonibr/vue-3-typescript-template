<template>
  <div class="chart-container">
    <bar-chart height="100%" width="100%" />
  </div>
</template>

<script lang="ts">
import BarChart from '@/components/Charts/BarChart.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BarChartDemo',
  components: {
    BarChart
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
