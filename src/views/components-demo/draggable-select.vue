<template>
  <div class="components-container">
    <draggable-select v-model="value" style="width: 500px" multiple placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </draggable-select>

    <div style="margin-top: 30px">
      <el-tag v-for="item of value" :key="item" style="margin-right: 15px">
        {{ item }}
      </el-tag>
    </div>
  </div>
</template>

<script lang="ts">
import DraggableSelect from '@/components/DraggableSelect/index.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DraggableSelectDemo',
  components: {
    DraggableSelect
  },
  setup() {
    const value = ref(['Apple', 'Banana', 'Orange'])
    const options = ref([
      {
        value: 'Apple',
        label: 'Apple'
      },
      {
        value: 'Banana',
        label: 'Banana'
      },
      {
        value: 'Orange',
        label: 'Orange'
      },
      {
        value: 'Pear',
        label: 'Pear'
      },
      {
        value: 'Strawberry',
        label: 'Strawberry'
      }
    ])
    return { value, options }
  }
})
</script>
