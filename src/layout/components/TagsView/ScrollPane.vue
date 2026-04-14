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
import { onMounted, defineComponent, ref } from 'vue'

const tagSpacing = 4
type TagRef = HTMLElement | { $el: HTMLElement }

export default defineComponent({
  name: 'ScrollPane',
  emits: ['scroll'],
  setup() {
    const scrollContainer = ref<InstanceType<typeof ElScrollbar> | null>(null)
    return {
      scrollContainer
    }
  },
  mounted() {
    onMounted(() => this.scrollWrapper.addEventListener('scroll', this.emitScroll, true))
  },
  beforeUnmount() {
    this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
  },
  computed: {
    scrollWrapper() {
      return (this.$refs.scrollContainer as unknown as { $refs: { wrapRef: HTMLElement } }).$refs
        .wrapRef as HTMLElement
    }
  },
  methods: {
    getTagElement(tag: TagRef) {
      return '$el' in tag ? tag.$el : tag
    },
    handleScroll(e: WheelEvent) {
      this.$refs.scrollContainer
      const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
      const scrollWrapper = this.scrollWrapper
      scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4
    },
    emitScroll() {
      this.$emit('scroll')
    },
    moveToTarget(currentTag: TagRef) {
      const container = (this.$refs.scrollContainer as unknown as { $el: HTMLElement }).$el
      const containerWidth = container.offsetWidth
      const scrollWrapper = this.scrollWrapper

      const tagList = (((this.$parent?.$refs.tag as TagRef[]) ?? []).map((tag) =>
        this.getTagElement(tag)
      )) as HTMLElement[]
      const currentTagEl = this.getTagElement(currentTag)

      let firstTag: HTMLElement | null = null
      let lastTag: HTMLElement | null = null

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      if (firstTag === currentTagEl) {
        scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTagEl) {
        scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item) => item === currentTagEl)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]
        if (!prevTag || !nextTag) return
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagSpacing
        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagSpacing

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
