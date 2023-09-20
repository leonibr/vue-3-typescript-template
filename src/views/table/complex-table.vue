<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.title')"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        :placeholder="$t('table.importance')"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        :placeholder="$t('table.type')"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.displayName + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" :icon="Search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        :icon="Edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        :icon="Download"
        @click="handleDownload"
      >
        {{ $t('table.export') }}
      </el-button>
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey = tableKey + 1"
      >
        {{ $t('table.reviewer') }}
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="180px" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.title')" min-width="150px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ typeFilter(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.author')" width="180px" align="center">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        :label="$t('table.reviewer')"
        width="110px"
        align="center"
      >
        <template #default="{ row }">
          <span style="color: red">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.importance')" width="105px">
        <template #default="{ row }">
          <el-icon
            size="20"
            v-for="n in Array.from({ length: +row.importance }, (_, i) => i + 1)"
            :key="n"
            style="color: rgb(215, 215, 42)"
            class="meta-item__icon"
          >
            <star-filled />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.readings')" align="center" width="95">
        <template #default="{ row }">
          <span v-if="row.pageviews" class="link-type" @click="handleGetPageviews(row.pageviews)">{{
            row.pageviews
          }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template #default="{ row }">
          <el-tag :type="articleStatusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template #default="{ row, $index }">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="row.status !== 'published'"
            size="small"
            type="success"
            @click="handleModifyStatus(row, 'published')"
          >
            {{ $t('table.publish') }}
          </el-button>
          <el-button
            v-if="row.status !== 'draft'"
            size="small"
            @click="handleModifyStatus(row, 'draft')"
          >
            {{ $t('table.draft') }}
          </el-button>
          <el-button
            v-if="row.status !== 'deleted'"
            size="small"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempArticleData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="tempArticleData.type" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker
            v-model="tempArticleData.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="tempArticleData.title" />
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="tempArticleData.status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate
            v-model="tempArticleData.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top: 8px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input
            v-model="tempArticleData.abstractContent"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model:visible="dialogPageviewsVisible" title="Reading statistics">
      <el-table :data="pageviewsData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pageviews" label="Pageviews" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogPageviewsVisible = false">{{
            $t('table.confirm')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElForm, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import {
  getArticles,
  getPageviews,
  createArticle,
  updateArticle,
  defaultArticleData
} from '@/api/articles'
import { type IArticleData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import { ElNotification } from 'element-plus'
import { defineComponent, ref, reactive } from 'vue'
import { articleStatusFilter } from '@/utils/filters'
import { parseTime } from '@/utils'
import { StarFilled, Edit, Download, Search } from '@element-plus/icons-vue'

const calendarTypeOptionsSource = [
  { key: 'CN', displayName: 'China' },
  { key: 'US', displayName: 'USA' },
  { key: 'JP', displayName: 'Japan' },
  { key: 'EU', displayName: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptionsSource.reduce(
  (acc: { [key: string]: string }, cur) => {
    acc[cur.key] = cur.displayName
    return acc
  },
  {}
) as { [key: string]: string }

const typeFilter = (type: string) => {
  return calendarTypeKeyValue[type]
}

export default defineComponent({
  name: 'ComplexTable',
  components: {
    Pagination,
    StarFilled
  },
  setup() {
    const tableKey = ref(0)
    const list = ref<IArticleData[]>([])
    const total = ref(0)
    const listLoading = ref(true)
    const listQuery = ref({
      page: 1,
      limit: 20,
      importance: undefined,
      title: undefined,
      type: undefined,
      sort: '+id'
    })

    const importanceOptions = ref([1, 2, 3])
    const calendarTypeOptions = ref(calendarTypeOptionsSource)
    const sortOptions = ref([
      { label: 'ID Ascending', key: '+id' },
      { label: 'ID Descending', key: '-id' }
    ])

    const statusOptions = ref(['published', 'draft', 'deleted'])
    const showReviewer = ref(false)
    const dialogFormVisible = ref(false)
    const dialogStatus = ref('')
    const textMap = ref({
      update: 'Edit',
      create: 'Create'
    })

    const dialogPageviewsVisible = ref(false)
    const pageviewsData = ref([])
    const rules = ref({
      type: [{ required: true, message: 'type is required', trigger: 'change' }],
      timestamp: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
      title: [{ required: true, message: 'title is required', trigger: 'blur' }]
    })

    const downloadLoading = ref(false)
    const tempArticleData = ref(defaultArticleData)
    const dataForm = ref('')

    return {
      Edit,
      Search,
      Download,
      dataForm,
      tableKey,
      list,
      total,
      listLoading,
      listQuery,
      dialogPageviewsVisible,
      pageviewsData,
      rules,
      statusOptions,
      textMap,
      dialogStatus,
      dialogFormVisible,
      showReviewer,
      sortOptions,
      importanceOptions,
      calendarTypeOptions,
      downloadLoading,
      tempArticleData,
      articleStatusFilter,
      parseTime,
      typeFilter
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList(info?: { page: number; limit: number }) {
      const query = info ?? this.listQuery
      this.listLoading = true
      const { data } = await getArticles(query)
      this.list = reactive(data.items)
      this.total = data.total
      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    handleModifyStatus(row: any, status: string) {
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },

    sortChange(data: any) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },

    sortByID(order: string) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    getSortClass(key: string) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },

    resetTempArticleData() {
      this.tempArticleData = cloneDeep(defaultArticleData)
    },

    handleCreate() {
      this.resetTempArticleData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        debugger
        ;(this.$refs.dataForm as typeof ElForm).clearValidate()
      })
    },

    createData() {
      ;(this.$refs.dataForm as typeof ElForm).validate(async (valid) => {
        if (valid) {
          const articleData = this.tempArticleData
          articleData.id = Math.round(Math.random() * 100) + 1024 // mock a id
          articleData.author = 'vue-typescript-admin'
          const { data } = await createArticle({ article: articleData })
          data.article.timestamp = Date.parse(data.article.timestamp)
          this.list.unshift(data.article)
          this.dialogFormVisible = false
          ElNotification({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    handleUpdate(row: any) {
      this.tempArticleData = Object.assign({}, row)
      this.tempArticleData.timestamp = +new Date(this.tempArticleData.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        ;(this.$refs.dataForm as typeof ElForm).clearValidate()
      })
    },

    updateData() {
      ;(this.$refs.dataForm as typeof ElForm).validate(async (valid: any) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempArticleData)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          const { data } = await updateArticle(tempData.id, { article: tempData })
          const index = this.list.findIndex((v) => v.id === data.article.id)
          this.list.splice(index, 1, data.article)
          this.dialogFormVisible = false
          ElNotification({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    handleDelete(row: any, index: number) {
      ElNotification({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },

    async handleGetPageviews(pageviews: string) {
      const { data } = await getPageviews({ pageviews })
      this.pageviewsData = data.pageviews
      this.dialogPageviewsVisible = true
    },

    handleDownload() {
      this.downloadLoading = true
      const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      const data = formatJson(filterVal, this.list)
      exportJson2Excel(tHeader, data, 'table-list')
      this.downloadLoading = false
    }
  }
})
</script>
