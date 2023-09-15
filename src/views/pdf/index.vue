<template>
  <div class="app-container">
    <aside style="margin-top: 15px">
      {{ $t('pdf.tips') }}
    </aside>
    <router-link target="_blank" to="/pdf-download-example">
      <el-button type="primary"> Click to download PDF </el-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PDF'
})
</script>
