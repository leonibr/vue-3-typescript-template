<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template #default="{ row }">
        <span>{{ row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="Date">
      <template #default="{ row }">
        <span>{{ parseTime(row.timestamp) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="240px" label="Title">
      <template #default="{ row }">
        <span>{{ row.title }}</span>
        <el-tag>{{ row.type }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="Author">
      <template #default="{ row }">
        <span>{{ row.author }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="Importance">
      <template #default="{ row }">
        <icon
          v-for="n in Array.from({ length: +row.importance }, (_, i) => i + 1)"
          :key="n"
          :data="svg.Star"
          class="icon-star"
        />
      </template>
    </el-table-column>

    <el-table-column align="center" label="Readings" width="95">
      <template #default="{ row }">
        <span>{{ row.pageviews }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="Status" width="110">
      <template #default="{ row }">
        <el-tag :type="articleStatusFilter(row.status)">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { articleStatusFilter } from '@/utils/filters'
import { parseTime } from '@/utils'
import { getArticles } from '@/api/articles'
import { defineComponent, ref } from 'vue'
import { type IArticleData } from '@/api/types'
import Star from '@/icons/svg/star.svg'

export default defineComponent({
  name: 'TabPane',
  props: {
    type: { type: String, default: 'CN' }
  },
  setup(props) {
    const list = ref<IArticleData[] | null>(null)
    const listQuery = ref({
      page: 1,
      limit: 5,
      type: `${props.type}`,
      sort: 'id'
    })

    const loading = ref(false)
    return {
      list,
      listQuery,
      loading,
      parseTime,
      articleStatusFilter,
      svg: {
        Star
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      this.$emit('create') // for test
      const { data } = await getArticles(this.listQuery)
      this.list = data.items
      // Just to simulate the time of the request
      setTimeout(() => {
        this.loading = false
      }, 0.5 * 1000)
    }
  }
})
</script>
