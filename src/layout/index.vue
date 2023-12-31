<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <side-bar class="sidebar-container" />
    <div :class="{ hasTagsView: showTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <nav-bar />
        <tags-view v-if="showTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hamburger-container {
  outline: 1px solid #ccc;
  line-height: 46px;
  height: 100%;
  float: left;
  padding: 0 15px;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }

  .fixed-header {
    width: calc(100% - 54px);
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>

<script lang="ts">
import { useSettingsStore } from '@/stores/settings-store'
import AppMain from './components/AppMain.vue'
import NavBar from './components/NavBar.vue'
import SideBar from '@/layout/components/SideBar/index.vue'
import TagsView from '@/layout/components/TagsView/index.vue'
import { DeviceType, useAppStore } from '@/stores/app-store'
import { defineComponent, ref } from 'vue'
import ResizeMixin from '@/layout/mixins/resize-mixin'
import RightPanel from '@/components/RightPanel/index.vue'
import Settings from '@/layout/components/Settings.vue'

export default defineComponent({
  name: 'LayOut',
  components: {
    AppMain,
    NavBar,
    SideBar,
    RightPanel,
    TagsView,
    Settings
  },
  mixins: [ResizeMixin],
  setup() {
    const settingsStore = useSettingsStore()
    const appStore = useAppStore()
    // const mobile = this.isMobile.value
    return {
      appStore,
      settingsStore
    }
  },
  computed: {
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened.value,
        openSidebar: this.sidebar.opened.value,
        withoutAnimation: this.sidebar.withoutAnimation.value,
        mobile: this.device === DeviceType.Mobile
      }
    },
    showSettings() {
      return this.settingsStore.showSettings
    },
    showTagsView() {
      return this.settingsStore.showTagsView
    },
    fixedHeader() {
      return this.settingsStore.fixedHeader
    }
  },
  methods: {
    handleClickOutside() {
      this.appStore.closeSideBar(false)
    }
  }
})
</script>
