<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      Platfroms({{ platforms.length }})
      <el-icon class="el-icon--right">
        <caret-bottom />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-checkbox-group v-model="platforms" style="padding: 5px 15px">
          <el-checkbox v-for="item in platformsOptions" :key="item.key" :label="item.key">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { CaretBottom } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'PlatformDropdown',
  components: { CaretBottom },
  props: { modelValue: { type: Array<string>, required: true } },
  setup(props) {
    const platformsOptions = ref([
      { key: 'a-platform', name: 'a-platform' },
      { key: 'b-platform', name: 'b-platform' },
      { key: 'c-platform', name: 'c-platform' }
    ])

    const platforms = ref(props.modelValue)
    return { platforms, platformsOptions }
  },
  mounted() {
    watch(
      () => this.platforms,
      (newValue) => this.$emit('update:modelValue', newValue)
    )
  }
})
</script>
