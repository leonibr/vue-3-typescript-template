<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import type { ElScrollbar } from 'element-plus'
import { onMounted, defineComponent, ref, getCurrentInstance } from 'vue'
import { onBeforeUnmount } from 'vue'

const tagSpacing = 4

export default defineComponent({
  name: 'ScrollPane',
  emits: ['scroll'],
  setup() {
    const scrollContainer = ref<InstanceType<typeof ElScrollbar> | null>(null)

    return {
      scrollContainer
    }
  },

  created() {},
  mounted() {
    onMounted(() => {
      this.scrollWrapper.addEventListener('scroll', this.emitScroll, true)
    })

    onBeforeUnmount(() => {
      this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
    })
  },
  computed: {
    scrollWrapper() {
      return (this.$refs.scrollContainer as typeof ElScrollbar).$refs.wrap as HTMLElement
    }
  },
  methods: {
    handleScroll(e: WheelEvent) {
      this.$refs.scrollContainer
      const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
      const scrollWrapper = this.scrollWrapper
      scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4
    },
    emitScroll() {
      this.$emit('scroll')
    },
    moveToTarget(currentTag: HTMLElement) {
      const container = this.scrollContainer as unknown as HTMLElement
      const containerWidth = container.offsetWidth
      const scrollWrapper = this.scrollWrapper
      const instance = getCurrentInstance()!
      const tagList = instance.parent!.proxy!.tag as unknown as any[]

      let firstTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      if (firstTag === currentTag) {
        scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item) => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing
        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagSpacing

        if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
          scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth
        } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
          scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }
  }
})
</script>

<style lang="scss">
.scroll-container {
  .el-scrollbar__bar {
    bottom: 0px;
  }

  .el-scrollbar__wrap {
    height: 49px;
  }
}
</style>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
}
</style>
