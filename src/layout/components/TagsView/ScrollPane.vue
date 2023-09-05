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

<script setup lang="ts">
import { onMounted, defineComponent, ref, getCurrentInstance } from 'vue'
import { onBeforeUnmount } from 'vue'
const emit = defineEmits(['scroll'])

const tagSpacing = 4
const scrollContainer = ref(null)

function scrollWrapperFn() {
  return scrollContainer as unknown as HTMLElement
}

onMounted(() => {
  scrollWrapperFn().addEventListener('scroll', emitScroll, true)
})

onBeforeUnmount(() => {
  scrollWrapperFn().removeEventListener('scroll', emitScroll)
})

function handleScroll(e: WheelEvent) {
  const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
  const wrapper = scrollWrapperFn()
  wrapper.scrollLeft = wrapper.scrollLeft + eventDelta / 4
}

function emitScroll() {
  emit('scroll')
}

function moveToTarget(currentTag: HTMLElement) {
  const container = scrollContainer as unknown as HTMLElement
  const containerWidth = container.offsetWidth
  const scrollWrapper = scrollWrapperFn()
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

return {
  scrollContainer,
  moveToTarget
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'ScrollPane'
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
