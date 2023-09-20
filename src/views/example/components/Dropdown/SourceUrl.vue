<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      Link
      <el-icon class="el-icon--right">
        <caret-bottom />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-padding" style="width: 400px">
        <el-form-item label-width="0px" style="margin-bottom: 0px" prop="sourceURL">
          <el-input v-model="sourceURL" placeholder="Please enter the content">
            <template v-slot:prepend> URL </template>
          </el-input>
        </el-form-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { CaretBottom } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'SourceUrlDropdown',
  components: { CaretBottom },
  props: {
    modelValue: { type: String, required: true }
  },
  setup(props) {
    const sourceURL = ref(props)
    return {
      sourceURL
    }
  },
  mounted() {
    watch(
      () => this.sourceURL,
      (newValue) => this.$emit('update:modelValue', newValue)
    )
  }
})
</script>
