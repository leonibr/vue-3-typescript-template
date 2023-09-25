<template>
  <div style="display: inline-block">
    <label class="radio-label" style="padding-left: 0">Filename: </label>
    <el-input
      v-model="filename"
      :placeholder="$t('excel.placeholder')"
      style="width: 345px"
      prefix-icon="el-icon-document"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'FilenameOption',
  props: {
    modelValue: { type: String, required: true }
  },
  setup(props) {
    const filename = ref(props.modelValue)

    return {
      filename
    }
  },
  mounted() {
    watch(
      () => this.filename,
      (val) => this.$emit('update:modelValue', val)
    )
  }
})
</script>
