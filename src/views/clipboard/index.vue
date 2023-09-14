<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="use clipboard directly" name="directly">
        <el-input
          v-model="inputData"
          placeholder="Please input"
          style="width: 400px; max-width: 100%"
        />
        <el-button type="primary" :icon="document" @click="handleClipboard(inputData, $event)">
          copy
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="use clipboard by v-directive" name="v-directive">
        <el-input
          v-model="inputData"
          placeholder="Please input"
          style="width: 400px; max-width: 100%"
        />
        <el-button
          v-clipboard:copy="inputData"
          v-clipboard:success="clipboardSuccess"
          type="primary"
          :icon="document"
        >
          copy
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { handleClipboard, clipboardSuccess } from '@/utils/clipboard' // use clipboard directly
import { defineComponent, ref } from 'vue'
import { Document } from '@element-plus/icons-vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Clipboard',
  setup() {
    const activeName = ref('directly')
    const inputData = ref('https://github.com/Armour/vue-typescript-admin-template')
    return {
      handleClipboard,
      clipboardSuccess,
      inputData,
      activeName,
      document: Document
    }
  }
})
</script>
