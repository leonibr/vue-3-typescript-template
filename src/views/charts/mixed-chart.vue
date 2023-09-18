<template>
  <div class="chart-container">
    <mixed-chart height="100%" width="100%" />
  </div>
</template>

<script lang="ts">
import MixedChart from '@/components/Charts/MixedChart.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MixedChartDemo',
  components: {
    MixedChart
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
