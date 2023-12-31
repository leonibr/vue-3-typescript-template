<template>
  <div class="app-container">
    <el-input
      v-model="filename"
      placeholder="Please enter the file name (default excel-list)"
      style="width: 350px"
      prefix-icon="el-icon-document"
    />
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="primary"
      :icon="Document"
      @click="handleDownload"
    >
      {{ $t('excel.selectedExport') }}
    </el-button>
    <a
      href="https://armour.github.io/vue-typescript-admin-docs/features/components/excel.html"
      target="_blank"
      style="margin-left: 15px"
    >
      <el-tag type="info">Documentation</el-tag>
    </a>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="Id" width="95">
        <template #default="{ $index }">
          {{ $index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template #default="{ row }">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" align="center" width="180">
        <template #default="{ row }">
          <el-tag>{{ row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="115">
        <template #default="{ row }">
          {{ row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="PDate" width="220">
        <template #default="{ row }">
          <i class="el-icon-time" />
          <span>{{ parseTime(row.timestamp) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { getArticles } from '@/api/articles'
import { type IArticleData } from '@/api/types.d'
import { formatJson, parseTime } from '@/utils'
import { exportJson2Excel } from '@/utils/excel'
import { defineComponent, ref } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'SelectExcel',
  setup() {
    const list = ref<IArticleData[]>([])
    const listLoading = ref(true)
    const multipleSelection = ref([])
    const downloadLoading = ref(false)
    const filename = ref('')
    return {
      list,
      listLoading,
      multipleSelection,
      downloadLoading,
      filename,
      Document,
      parseTime
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const { data } = await getArticles({
        /* Your params here */
      })
      this.list = data.items
      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },

    handleSelectionChange(value: any) {
      this.multipleSelection = value
    },

    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
        const filterVal = ['id', 'title', 'author', 'pageviews', 'timestamp']
        const list = this.multipleSelection
        const data = formatJson(filterVal, list)
        exportJson2Excel(tHeader, data, this.filename !== '' ? this.filename : undefined)
        ;(this.$refs.multipleTable as typeof ElTable).clearSelection()
        this.downloadLoading = false
      } else {
        ElMessage({
          message: 'Please select at least one item',
          type: 'warning'
        })
      }
    }
  }
})
</script>
