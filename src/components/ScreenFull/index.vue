<template>
  <div id="screenfull">
    <icon :data="isFullScreen ? exitFullScreenSvg : fullScreenSvg" @click="click" />
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import screenfull from 'screenfull'
import exitFullScreenSvg from '@/icons/svg/exit-fullscreen.svg'
import fullScreenSvg from '@/icons/svg/fullscreen.svg'
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'

const sf = screenfull

export default defineComponent({
  name: 'ScreeFull',
  setup() {
    const isFullScreen = ref(false)
    return {
      isFullScreen,
      exitFullScreenSvg,
      fullScreenSvg
    }
  },
  created() {
    onMounted(() => {
      if (sf.isEnabled) {
        sf.on('change', this.change)
      }
    })

    onBeforeUnmount(() => {
      if (sf.isEnabled) {
        sf.off('change', this.change)
      }
    })
  },
  methods: {
    change() {
      if (sf.isEnabled) {
        this.isFullScreen = sf.isFullscreen
      }
    },

    click() {
      if (!sf.isEnabled) {
        ElMessage({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      sf.toggle()
    }
  }
})

class eeET {
  private isFullscreen = false

  mounted() {
    if (sf.isEnabled) {
      sf.on('change', this.change)
    }
  }

  beforeDestory() {
    if (sf.isEnabled) {
      sf.off('change', this.change)
    }
  }

  private change() {
    if (sf.isEnabled) {
      this.isFullscreen = sf.isFullscreen
    }
  }

  private click() {
    if (!sf.isEnabled) {
      this.$message({
        message: 'you browser can not work',
        type: 'warning'
      })
      return false
    }
    sf.toggle()
  }
}
</script>
