<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { scrollTo } from '@/utils/scroll-to'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Pagination',
  props: {
    total: { type: Number, required: true },
    page: { type: Number, default: 1 },
    limit: { type: Number, default: 20 },
    pageSizes: { type: Array<number>, default: () => [10, 20, 30, 50] },
    layout: { type: String, default: 'total, sizes, prev, pager, next, jumper' },
    background: { type: Boolean, default: true },
    autoScroll: { type: Boolean, default: true },
    hidden: { type: Boolean, default: false }
  },
  setup(props) {
    const currentPage = ref(props.page)
    const pageSize = ref(props.limit)
    return {
      currentPage,
      pageSize
    }
  },
  mounted() {
    watch(
      () => this.currentPage,
      (newSize) => this.$emit('update:page', newSize)
    )
    watch(
      () => this.pageSize,
      (newLimit) => this.$emit('update:limit', newLimit)
    )
  },
  methods: {
    handleSizeChange(value: number) {
      this.$emit('pagination', { page: this.currentPage, limit: value })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },

    handleCurrentChange(value: number) {
      this.$emit('pagination', { page: value, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
