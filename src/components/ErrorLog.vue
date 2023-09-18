<template>
  <div v-if="errorLogs.length > 0">
    <el-badge
      :is-dot="true"
      style="line-height: 25px; margin-top: -5px"
      @click="dialogTableVisible = true"
    >
      <el-button style="padding: 8px 10px" type="danger">
        <icon :data="bug" />
      </el-button>
    </el-badge>

    <el-dialog v-model="dialogTableVisible" width="80%" append-to-body>
      <template #header>
        <span style="padding-right: 10px">Error Log</span>
        <el-button size="small" type="primary" icon="el-icon-delete" @click="clearAll">
          Clear All
        </el-button>
      </template>
      <el-table :data="errorLogs" border>
        <el-table-column label="Message">
          <template #default="{ row }">
            <div>
              <span class="message-title">Msg:</span>
              <el-tag type="danger">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br />
            <div>
              <!--.$vnode.tag -->
              <span class="message-title" style="padding-right: 10px">Info: </span>
              <el-tag type="warning"> {{ row?.vm?.$node?.tag }} error in {{ row.info }} </el-tag>
            </div>
            <br />
            <div>
              <span class="message-title" style="padding-right: 16px">Url: </span>
              <el-tag type="success">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template #default="{ row }">
            <pre class="stack">{{ row.err.stack }}</pre>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useErrorLogStore } from '@/stores/error-log-store'
import bug from '@/icons/svg/bug.svg'

export default defineComponent({
  name: 'ErrorLog',
  setup() {
    const dialogTableVisible = ref(false)
    const errorStore = useErrorLogStore()
    return {
      errorStore,
      dialogTableVisible,
      bug
    }
  },
  computed: {
    errorLogs() {
      return this.errorStore.logs
    }
  },
  methods: {
    clearAll() {
      this.dialogTableVisible = false
      this.errorStore.clearErrorLog()
    }
  }
})
</script>

<style lang="scss" scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
.stack {
  overflow: scroll;
  font-size: 12px;
  line-height: 1.5;
}
</style>
