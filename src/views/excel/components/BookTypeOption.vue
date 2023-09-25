<template>
  <div style="display: inline-block">
    <label class="radio-label">Book Type: </label>
    <el-select v-model="bookType" style="width: 120px">
      <el-option v-for="item in options" :key="item" :label="item" :value="item" />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'BookTypeOption',
  props: {
    modelValue: { type: String, required: true }
  },
  setup(props) {
    const bookType = ref(props.modelValue)
    const options = ref(['xlsx', 'csv', 'txt'])
    return {
      bookType,
      options
    }
  },
  mounted() {
    watch(
      () => this.bookType,
      (val) => this.$emit('update:modelValue', val)
    )
  }
})
</script>
