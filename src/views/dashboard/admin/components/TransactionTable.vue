<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px">
    <el-table-column label="OrderID" min-width="200">
      <template #default="scope">
        {{ orderNoFilter(scope.row.orderId) }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template #default="scope">¥{{ toThousandFilter(scope.row.price) }} </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template #default="scope">
        <el-tag :type="transactionStatusFilter(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { getTransactions } from '@/api/transactions'
import { type ITransactionData } from '@/api/types'
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TransactionTable',
  created() {
    this.fetchData()
  },
  setup() {
    const list = ref<ITransactionData[]>([])
    return { list }
  },
  methods: {
    transactionStatusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter: (str: string) => str.substring(0, 30),
    // Input 10000 => Output "10,000"
    toThousandFilter: (num: number) => {
      return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    },
    async fetchData() {
      const { data } = await getTransactions({
        /* Your params here */
      })    
      this.list = data.items.slice(0, 8)
    }
  }
})
</script>
