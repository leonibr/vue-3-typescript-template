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
      <el-table-column align="center" label="ID" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Author" width="180px">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="105px" label="Importance">
        <template #default="{ row }">
          <template v-for="n in +row.importance" :key="n">
            <el-icon size="20" style="color: rgb(215, 215, 42)" class="meta-item__icon">
              <star-filled />
            </el-icon>
          </template>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template #default="{ row }">
          <el-tag :type="articleStatusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="250px" label="Title">
        <template v-slot="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              :icon="svg.Refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template v-slot="{ row }">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            :icon="svg.CircleCheck"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            :icon="svg.Edit"
            @click="row.edit = !row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { getArticles } from '@/api/articles'
import { type IArticleData } from '@/api/types'
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { articleStatusFilter, uppercaseFirstChar } from '@/utils/filters'
import { parseTime } from '@/utils'
import { CircleCheck, Edit, StarFilled, Refresh, Star } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'InlineEditTable',
  components: { StarFilled },
  setup() {
    const list = ref<IArticleData[]>([])
    const listLoading = ref(true)
    const listQuery = ref({
      page: 1,
      limit: 10
    })

    return {
      list,
      listLoading,
      listQuery,
      articleStatusFilter,
      uppercaseFirstChar,
      parseTime,
      svg: {
        CircleCheck,
        Edit,
        Refresh
      },
      StarFilled
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getArticles(this.listQuery)
      const items = data.items
      this.list = items.map((v: any) => {
        v.edit = false
        //this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title // will be used when user click the cancel botton
        return v
      })
      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },

    cancelEdit(row: any) {
      row.title = row.originalTitle
      row.edit = false
      ElMessage({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },

    confirmEdit(row: any) {
      row.edit = false
      row.originalTitle = row.title
      ElMessage({
        message: 'The title has been edited',
        type: 'success'
      })
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
