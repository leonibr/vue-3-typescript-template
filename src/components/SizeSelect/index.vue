<template>
  <el-dropdown id="size-select" trigger="click" @command="handleSetSize">
    <div>
      <icon class="size-icon" :data="sizeSvg" />
    </div>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useAppStore } from '@/stores/app-store'
import { useTagsViewStore } from '@/stores/tags-view-store'
import sizeSvg from '@/icons/svg/size.svg'
import { ElMessage } from 'element-plus'
import type { SizeType } from '@/stores/app-store'

type SelectType = {
  label: string
  value: SizeType
}

export default defineComponent({
  name: 'SizeSelect',
  setup() {
    const appStore = useAppStore()
    const tagsViewStore = useTagsViewStore()
    const sizeOptions = reactive<SelectType[]>([
      { label: 'Default', value: 'default' },
      { label: 'Small', value: 'small' },
      { label: 'Large', value: 'large' }
    ])
    return {
      appStore,
      sizeOptions,
      tagsViewStore,
      sizeSvg
    }
  },
  computed: {
    size() {
      return this.appStore.size
    }
  },
  methods: {
    handleSetSize(size: SizeType) {
      /* TODO: find a proper way to set this in Element-Plus
      ;(this as any).$ELEMENT.size = size*/
      this.appStore.setSize(size)
      this.refreshView()
      ElMessage({
        message: 'Switch Size Success',
        type: 'success'
      })
    },

    refreshView() {
      // In order to make the cached page re-rendered
      this.tagsViewStore.delAllCachedViews()
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router
          .replace({
            path: '/redirect' + fullPath
          })
          .catch((err) => {
            console.warn(err)
          })
      })
    }
  }
})
</script>
