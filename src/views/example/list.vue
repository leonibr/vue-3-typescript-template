<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="80" align="center" label="ID">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Author">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="105px" label="Importance">
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

      <el-table-column class-name="status-col" label="Status" width="110">
        <template #default="{ row }">
          <el-tag :type="articleStatusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template #default="{ row }">
          <router-link :to="'/example/edit/' + row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template #default="{ row }">
          <router-link :to="'/example/edit/' + row.id">
            <el-button type="primary" size="small" :icon="Edit"> Edit </el-button>
          </router-link>
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
  </div>
</template>

<script lang="ts">
import { getArticles } from '@/api/articles'
import { type IArticleData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { articleStatusFilter } from '@/utils/filters'
import { defineComponent, ref } from 'vue'
import { parseTime } from '@/utils'
import { Edit, StarFilled } from '@element-plus/icons-vue'

type PageInfo = {
  page: number
  limit: number
}

export default defineComponent({
  name: 'ArticleList',
  components: {
    Pagination,
    StarFilled
  },
  setup() {
    const total = ref(0)
    const list = ref<IArticleData[]>([])
    const listLoading = ref(true)
    const listQuery = ref<PageInfo>({
      page: 1,
      limit: 20
    })

    return {
      total,
      list,
      listLoading,
      listQuery,
      articleStatusFilter,
      parseTime,
      Edit
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList(info?: PageInfo) {
      const query = info ? info : this.listQuery
      this.listLoading = true
      const { data } = await getArticles(query)
      console.log({ data })
      // Just to simulate the time of the request
      setTimeout(() => {
        this.list = data.items
        this.total = data.total
        this.listLoading = false
      }, 0.8 * 1000)
    }
  }
})
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
