<template>
  <transition :name="transitionName">
    <div v-show="visible" :style="customStyle" class="back-to-ceiling" @click="backToTop">
      <icon :data="BackTop" name="back-top" class="backTopIcon" />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BackTop from '@/icons/svg/back-top.svg'
export default defineComponent({
  name: 'BackToTop',
  props: {
    visibilityHeight: {
      type: Number,
      default: 400
    },
    transitionName: {
      type: String,
      default: 'fade'
    },
    backPosition: {
      type: Number,
      default: 0
    },
    customStyle: {
      type: Object,
      default: () => ({
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px',
        background: '#e7eaf1'
      })
    }
  },
  setup() {
    const visible = ref(false)
    const isMoving = ref(false)
    // const interval = ref(0)
    return {
      visible,
      isMoving,
      BackTop
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.visible = window.pageYOffset > this.visibilityHeight
    },

    backToTop() {
      if (this.isMoving) return
      const start = window.pageYOffset
      let i = 0
      this.isMoving = true
      const interval = setInterval(() => {
        const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
        if (next <= this.backPosition) {
          window.scrollTo(0, this.backPosition)
          clearInterval(interval)
          this.isMoving = false
        } else {
          window.scrollTo(0, next)
        }
        i++
      }, 16.7)
    },

    easeInOutQuad(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    }
  }
})
</script>

<style lang="scss" scoped>
.back-to-ceiling {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;

  :hover {
    background: #d5dbe7;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.back-to-ceiling .backTopIcon {
  fill: #9aaabf;
  background: none;
}
</style>
