<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top: 20px">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script lang="ts">
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'UploadExcel',
  components: {
    UploadExcelComponent
  },
  setup() {
    const tableData = ref([])
    const tableHeader = ref<string[]>([])
    return {
      tableData,
      tableHeader
    }
  },
  methods: {
    beforeUpload(file: File) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      ElMessage({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },

    handleSuccess({ results, header }: { results: any; header: string[] }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
})
</script>
