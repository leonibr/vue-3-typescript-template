<template>
  <div :class="{ 'has-logo': showLogo }">
    <sidebar-logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="menuActiveTextColor"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app-store'
import { useSettingsStore } from '@/stores/settings-store'
import { usePermissionStore } from '@/stores/permission'

export default defineComponent({
  name: 'SideBar',
  components: {
    SidebarItem,
    SidebarLogo
  },
  data() {
    const appStore = useAppStore()
    const settingsStore = useSettingsStore()
    const permissionStore = usePermissionStore()
    return {
      appStore,
      settingsStore,
      permissionStore
    }
  },
  computed: {
    sidebar() {
      return this.appStore.sidebar
    },

    routes() {
      return this.permissionStore.routes
    },

    showLogo() {
      return this.settingsStore.showSidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    menuActiveTextColor() {
      if (this.settingsStore.sidebarTextTheme) {
        return this.settingsStore.theme
      } else {
        return this.variables.menuActiveText
      }
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    },
    variables() {
      return { menuBg: '#304156', menuText: '#bfcbd9', menuActiveText: '#409EFF' } //variables
    }
  },
  methods: {}
})
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition:
      0s width ease-in-out,
      0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - 50px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
