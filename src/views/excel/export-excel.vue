<template>
  <div class="app-container">
    <div>
      <filename-option v-model="filename" />
      <auto-width-option v-model="autoWidth" />
      <book-type-option v-model="bookType" />
      <el-button
        :loading="downloadLoading"
        style="margin: 0 0 20px 20px"
        type="primary"
        :icon="Document"
        @click="handleDownload"
      >
        {{ $t('excel.export') }} Excel
      </el-button>
      <a
        href="https://armour.github.io/vue-typescript-admin-docs/features/components/excel.html"
        target="_blank"
        style="margin-left: 15px"
      >
        <el-tag type="info">Documentation</el-tag>
      </a>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
    >
      <el-table-column width="95" align="center" label="Id">
        <template v-slot="{ $index }">
          {{ $index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template v-slot="{ row }">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="180" align="center">
        <template v-slot="{ row }">
          <el-tag>{{ row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="115" align="center" label="Readings">
        <template v-slot="{ row }">
          {{ row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" label="Date">
        <template v-slot="{ row }">
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
import { formatJson } from '@/utils'
import { exportJson2Excel } from '@/utils/excel'
import FilenameOption from './components/FilenameOption.vue'
import AutoWidthOption from './components/AutoWidthOption.vue'
import BookTypeOption from './components/BookTypeOption.vue'
import { ref, defineComponent } from 'vue'
import { parseTime } from '@/utils'
import { Document } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ExportExcel',
  components: {
    AutoWidthOption,
    BookTypeOption,
    FilenameOption
  },
  setup() {
    const list = ref<IArticleData[]>([])
    const listLoading = ref(true)
    const downloadLoading = ref(false)
    const filename = ref('')
    const autoWidth = ref(true)
    const bookType = ref('xlsx')
    return {
      list,
      listLoading,
      downloadLoading,
      filename,
      autoWidth,
      bookType,
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
      const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      const filterVal = ['id', 'title', 'author', 'pageviews', 'timestamp']
      const list = this.list
      const data = formatJson(filterVal, list)
      exportJson2Excel(
        tHeader,
        data,
        this.filename !== '' ? this.filename : undefined,
        undefined,
        undefined,
        this.autoWidth,
        this.bookType
      )
      this.downloadLoading = false
    }
  }
})
</script>

<style lang="scss">
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
