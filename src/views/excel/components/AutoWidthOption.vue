<template>
  <div style="display: inline-block">
    <label class="radio-label">Cell Auto-Width: </label>
    <el-radio-group v-model="autoWidth">
      <el-radio :label="true" border> True </el-radio>
      <el-radio :label="false" border> False </el-radio>
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'AutoWidthOption',
  props: {
    modelValue: { type: Boolean, required: true }
  },
  setup(props) {
    const autoWidth = ref(props.modelValue)

    return {
      autoWidth
    }
  },
  mounted() {
    watch(
      () => this.autoWidth,
      (val) => this.$emit('update:modelValue', val)
    )
  }
})
</script>
