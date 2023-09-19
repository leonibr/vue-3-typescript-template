<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="draggableTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="Drag" width="80">
        <icon class="draggable-handler" :data="svg.Drag" width="20" height="20" />
      </el-table-column>
      <el-table-column align="center" label="ID" width="65" prop="id" />

      <el-table-column width="180px" align="center" label="Date">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="Title" prop="title" />
      <el-table-column width="180px" align="center" label="Author" prop="author" />
      <el-table-column width="105px" label="Importance">
        <template #default="{ row }">
          <icon v-for="n in +row.importance" :key="n" :data="svg.Star" class="icon-star" />
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
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <div class="show-d">
      <el-tag style="margin-right: 12px"> {{ $t('table.dragTips1') }} : </el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>{{ $t('table.dragTips2') }} :</el-tag> {{ newList }}
    </div>
  </div>
</template>

<script lang="ts">
import Sortable from 'sortablejs'
import { getArticles } from '@/api/articles'
import { type IArticleData } from '@/api/types'
import { defineComponent, ref, reactive } from 'vue'
import { parseTime } from '@/utils'
import { articleStatusFilter } from '@/utils/filters'
import Drag from '@/icons/svg/drag.svg'
import Star from '@/icons/svg/star.svg'

export default defineComponent({
  name: 'DraggableTable',
  setup() {
    const list = ref<IArticleData[]>([])
    const listLoading = ref(true)
    const total = ref([])
    const oldList = ref<number[]>([])
    const newList = ref<number[]>([])
    const listQuery = ref({
      page: 1,
      limit: 10
    })
    const draggableTable = ref()

    const sortable = reactive<Sortable | null>(null)
    return {
      sortable,
      list,
      listLoading,
      total,
      oldList,
      newList,
      listQuery,
      parseTime,
      articleStatusFilter,
      draggableTable,
      svg: {
        Drag,
        Star
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getArticles(this.listQuery)
      this.list = data.items
      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
      this.total = data?.total as unknown as never[]
      this.oldList = this.list.map((v) => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },

    setSort() {
      const el = (this.$refs.draggableTable as any).$el.querySelectorAll(
        '.el-table__body-wrapper > .el-scrollbar > .el-scrollbar__wrap > .el-scrollbar__view > .el-table__body > tbody'
      )[0] as HTMLElement
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder
        onEnd: (evt) => {
          if (typeof evt.oldIndex !== 'undefined' && typeof evt.newIndex !== 'undefined') {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)
            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        }
      })
    }
  }
})
</script>

<style lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style lang="scss" scoped>
.icon-star {
  margin-right: 2px;
  color: #d7d72a;
}

.draggable-handler {
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>
