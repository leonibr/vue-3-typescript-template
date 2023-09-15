<template>
  <div class="app-container">
    <el-input
      v-model="filename"
      placeholder="Please enter the file name (default file)"
      style="width: 300px"
      :prefix-icon="Document"
      auto-complete="off"
    />
    <el-button :loading="downloadLoading" type="primary" :icon="Document" @click="handleDownload">
      Export Zip
    </el-button>
    <div style="margin-top: 20px"></div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template v-slot="{ $index }">
          {{ $index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template v-slot="{ row }">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" align="center" width="180">
        <template v-slot="{ row }">
          <el-tag>{{ row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="115">
        <template v-slot="{ row }">
          {{ row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="Date" align="center" width="220">
        <template v-slot="{ row }">
          <i class="el-icon-time" />
          <span>{{ row.timestamp }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { getArticles } from '@/api/articles'
import { type IArticleData } from '@/api/types'
import { formatJson } from '@/utils'
import { exportTxt2Zip } from '@/utils/zip'
import { defineComponent, ref, reactive } from 'vue'
import { Document } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ExportZip',
  created() {
    this.fetchData()
  },
  setup() {
    const list = reactive<IArticleData[]>([])
    const listLoading = ref(true)
    const downloadLoading = ref(false)
    const filename = ref('')
    return {
      list,
      listLoading,
      downloadLoading,
      filename,
      Document
    }
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
      const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      const filterVal = ['id', 'title', 'author', 'pageviews', 'timestamp']
      const list = this.list
      const data = formatJson(filterVal, list)
      if (this.filename !== '') {
        exportTxt2Zip(tHeader, data, this.filename, this.filename)
      } else {
        exportTxt2Zip(tHeader, data)
      }
      this.downloadLoading = false
    }
  }
})
</script>
