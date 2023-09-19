<template>
  <div ref="rightPanel" :class="{ show: show }" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div
        class="handle-button"
        :style="{ top: buttonTop + 'px', 'background-color': theme }"
        @click="show = !show"
      >
        <el-icon>
          <setting v-if="!show" />
          <close v-if="show" />
        </el-icon>
      </div>
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { addClass, removeClass } from '@/utils'
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '@/stores/settings-store'
import { Close, Setting } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'RightPanel',
  components: {
    Close,
    Setting
  },
  props: {
    clickNotClose: {
      type: Boolean,
      default: false
    },
    buttonTop: {
      type: Number,
      default: 250
    }
  },
  setup() {
    const settingsStore = useSettingsStore()
    const show = ref(false)

    return {
      settingsStore,
      show
    }
  },
  created() {
    watch(ref(this.show), this.onShowChange)
    onMounted(this.insertToBody)
    onBeforeUnmount(this.beforeDestroy)
  },
  computed: {
    theme() {
      return this.settingsStore.theme
    }
  },
  methods: {
    onShowChange(value: boolean) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    },
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(ev: MouseEvent) {
      const parent = (ev.target as HTMLElement).closest('.rightPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.rightPanel as Element
      const body = document.querySelector('body')
      if (body) {
        body.insertBefore(elx, body.firstChild)
      }
    },
    beforeDestroy() {
      const elx = this.$refs.rightPanel as Element
      elx.remove()
    }
  }
})
</script>

<style lang="scss">
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  padding-top: 4px;
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  cursor: pointer;
  pointer-events: auto;
  color: #fff;
  line-height: 48px;

  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
