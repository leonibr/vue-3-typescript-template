<template>
  <div :style="{ height: height, zIndex: zIndex }">
    <div
      :class="className"
      :style="{
        top: isSticky ? stickyTop + 'px' : '',
        zIndex: zIndex,
        position: position,
        width: width,
        height: height
      }"
    >
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Sticky',
  props: {
    stickyTop: { type: Number, default: 0 },
    zIndex: { type: Number, default: 1 },
    className: { type: String, default: '' }
  },
  setup() {
    const active = ref(false)
    const position = ref('')
    const isSticky = ref(false)
    const width = ref('auto')
    const height = ref('auto')

    return {
      active,
      position,
      isSticky,
      width,
      height
    }
  },
  activated() {
    this.handleScroll()
  },
  mounted() {
    this.height = this.$el.getBoundingClientRect().height.toString() + 'px'
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    sticky() {
      if (this.active) {
        return
      }
      this.position = 'fixed'
      this.active = true
      this.width = this.width + 'px'
      this.isSticky = true
    },

    handleReset() {
      if (!this.active) {
        return
      }
      this.position = ''
      this.width = 'auto'
      this.active = false
      this.isSticky = false
    },

    handleScroll() {
      const width = this.$el.getBoundingClientRect().width
      this.width = width.toString() + 'px' || 'auto'
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop < this.stickyTop) {
        this.sticky()
        return
      }
      this.handleReset()
    },

    handleResize() {
      if (this.isSticky) {
        this.width = this.$el.getBoundingClientRect().width.toString() + 'px'
      }
    }
  }
})
</script>
