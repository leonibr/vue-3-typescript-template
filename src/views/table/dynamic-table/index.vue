<template>
  <div class="app-container">
    <div style="margin: 0 0 5px 20px">
      {{ $t('table.dynamicTips1') }}
    </div>
    <fixed-header-table />

    <div style="margin: 30px 0 5px 20px">
      {{ $t('table.dynamicTips2') }}
    </div>
    <unfixed-header-table />
  </div>
</template>

<script lang="ts">
import FixedHeaderTable from './components/FixedHeaderTable.vue'
import UnfixedHeaderTable from './components/UnfixedHeaderTable.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DynamicTable',
  components: {
    FixedHeaderTable,
    UnfixedHeaderTable
  }
})
</script>
