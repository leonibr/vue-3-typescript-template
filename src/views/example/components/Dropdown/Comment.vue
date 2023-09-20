<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ !disableComment ? 'Comment: opened' : 'Comment: closed' }}
      <el-icon class="el-icon--right">
        <caret-bottom />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-padding">
        <el-dropdown-item>
          <el-radio-group v-model="disableComment" style="padding: 10px">
            <el-radio :label="true"> Close comment </el-radio>
            <el-radio :label="false"> Open comment </el-radio>
          </el-radio-group>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { CaretBottom } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'CommentDropdown',
  components: { CaretBottom },
  props: { modelValue: { type: Boolean, required: true } },
  setup(props) {
    const disableComment = ref(props.modelValue)

    return { disableComment }
  },
  mounted() {
    watch(
      () => this.disableComment,
      (newValue) => this.$emit('update:modelValue', newValue)
    )
  }
})
</script>
