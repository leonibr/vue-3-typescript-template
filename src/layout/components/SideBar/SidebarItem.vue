<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[isCollapse ? 'simple-mode' : 'full-mode', { 'first-level': isFirstLevel }]"
  >
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild!.children">
      <sidebar-item-link v-if="theOnlyOneChild!.meta" :to="resolvePath(theOnlyOneChild!.path)">
        <el-menu-item
          :index="resolvePath(theOnlyOneChild!.path)"
          :class="{ 'submenu-title-noDropdown': isFirstLevel }"
        >
          <icon
            v-if="theOnlyOneChild!.meta!.icon"
            :data="mapIcon(theOnlyOneChild!.meta!.icon as string)"
          />
          <span v-if="theOnlyOneChild!.meta!.title">{{
            $t('route.' + theOnlyOneChild!.meta!.title)
          }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <icon v-if="item.meta && item.meta.icon" :data="mapIcon(item.meta.icon as string)" />
        <span v-if="item.meta && item.meta.title">{{ $t('route.' + item.meta.title) }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
// import resolve from 'url-resolve-browser'
import { type RouteRecordRaw } from 'vue-router'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'
import { defineComponent, type PropType, watch } from 'vue'
import { mapperToIcon } from './mapper-icon'
import NotFound from '@/icons/svg/404.svg'
import path from 'path-browserify'

export default defineComponent({
  name: 'SidebarItem',
  components: {
    SidebarItemLink
  },
  props: {
    item: {
      required: true,
      type: Object as PropType<RouteRecordRaw>
    },
    isCollapse: {
      default: false
    },
    isFirstLevel: {
      default: true
    },
    basePath: {
      default: ''
    }
  },
  mounted() {
    watch(
      () => this.isCollapse,
      () => {
        if (!this.isFirstLevel) console.log({ isCollapse: this.isCollapse })
      }
    )
  },
  computed: {
    theOnlyOneChild() {
      if (this.showingChildNumber() > 1) {
        return null
      }
      if (this.item.children) {
        for (const child of this.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child
          }
        }
      }
      // If there is no children, return itself with path removed,
      // because this.basePath already conatins item's path information
      return { ...this.item, path: '' }
    },
    alwaysShowRootMenu() {
      if (this.item.meta && this.item.meta.alwaysShow) {
        return true
      }
      return false
    }
  },
  methods: {
    mapIcon(icon: string) {
      return mapperToIcon[icon] ?? NotFound
    },

    showingChildNumber() {
      if (this.item.children) {
        const showingChildren = this.item.children.filter((item) => {
          if (item.meta && item.meta.hidden) {
            return false
          } else {
            return true
          }
        })
        return showingChildren.length
      }
      return 0
    },

    resolvePath(routePath: string) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
})
</script>

<style lang="scss">
// .el-submenu.is-active > .el-submenu__title
// .el-menu-item.is-active {
//  color: $subMenuActiveText !important;
//}

.full-mode {
  &.first-level {
    background-color: var(--el-menu-bg-color);
  }
  // .nest-menu .el-submenu > .el-submenu__title,
  .nest-menu .el-menu-item,
  .full-mode.nest-menu .el-sub-menu .el-sub-menu__title,
  .el-sub-menu {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }

  .el-sub-menu__title:hover {
    background-color: var(--el-menu-hover-bg-color) !important;
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
