<template>
  <el-select
    ref="draggableSelect"
    v-model="mutableValue"
    v-bind="$attrs"
    class="draggable-select"
    multiple
  >
    <slot />
  </el-select>
</template>

<script lang="ts">
import Sortable from 'sortablejs'
import { defineComponent, ref, reactive } from 'vue'
import { ElSelect } from 'element-plus'

export default defineComponent({
  name: 'DraggableSelect',
  props: {
    modelValue: {
      type: Array<string>,
      required: true
    }
  },
  setup(props) {
    const sortable = ref<Sortable | null>(null)

    const mutableValue = reactive(props.modelValue)
    return {
      sortable,
      mutableValue
    }
  },
  mounted() {
    // watch(ref(this.mutableValue), (newValue) => this.$emit('input', [...(newValue as any[])]))
    this.setSort()
  },
  methods: {
    setSort() {
      const draggableSelect = this.$refs.draggableSelect as typeof ElSelect
      const el = draggableSelect.$el.querySelectorAll('.el-select__tags > span')[0] as HTMLElement
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder
        onEnd: (evt) => {
          if (typeof evt.oldIndex !== 'undefined' && typeof evt.newIndex !== 'undefined') {
            const targetRow = this.mutableValue.splice(evt.oldIndex, 1)[0]
            this.mutableValue.splice(evt.newIndex, 0, targetRow)
          }
        }
      })
    }
  }
})
</script>

<style lang="scss">
.draggable-select .sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

.draggable-select .el-tag {
  cursor: pointer;
}
</style>
