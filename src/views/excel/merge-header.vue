<template>
  <div class="app-container">
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="primary"
      :icon="Document"
      @click="handleDownload"
    >
      {{ $t('excel.export') }}
    </el-button>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" width="95">
        <template #default="{ $index }">
          {{ $index }}
        </template>
      </el-table-column>
      <el-table-column label="Main Information" align="center">
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
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
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
import { Document } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'MergeHeader',
  setup() {
    const list = ref<IArticleData[]>([])
    const listLoading = ref(true)
    const downloadLoading = ref(false)
    return {
      list,
      listLoading,
      downloadLoading,
      parseTime,
      Document
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

    handleDownload() {
      this.downloadLoading = true
      const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
      const header = ['', 'Title', 'Author', 'Readings', '']
      const filterVal = ['id', 'title', 'author', 'pageviews', 'timestamp']
      const list = this.list
      const data = formatJson(filterVal, list)
      const merges = ['A1:A2', 'B1:D1', 'E1:E2']
      exportJson2Excel(header, data, 'merge-header', multiHeader, merges)
      this.downloadLoading = false
    }
  }
})
</script>
