<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span class="tag-title">
          {{ $t('route.' + tag.meta!.title) }}
        </span>

        <el-icon
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <close />
        </el-icon>
      </router-link>
    </scroll-pane>
    <ul
      v-show="state.visible"
      :style="{ left: state.left + 'px', top: state.top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(state.selectedTag)">
        {{ $t('tagsView.refresh') }}
      </li>
      <li v-if="!isAffix(state.selectedTag)" @click="closeSelectedTag(state.selectedTag)">
        {{ $t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">
        {{ $t('tagsView.closeOthers') }}
      </li>
      <li @click="closeAllTags(state.selectedTag)">
        {{ $t('tagsView.closeAll') }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import path from 'path-browserify'
import { useTagsViewStore, type ITagView } from '@/stores/tags-view-store'
import { defineComponent, reactive, watch } from 'vue'
import ScrollPane from './ScrollPane.vue'
import { useRoute, type RouteRecordRaw } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { Close } from '@element-plus/icons-vue'

type TagsViewState = {
  visible: boolean
  top: number
  left: number
  selectedTag: ITagView
  affixTags: ITagView[]
}

export default defineComponent({
  name: 'TagsView',
  components: { ScrollPane, Close },
  setup() {
    const route = useRoute()
    const tagsStore = useTagsViewStore()
    const permissionStore = usePermissionStore()
    const state: TagsViewState = reactive({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {} as ITagView,
      affixTags: [] as ITagView[]
    })
    return {
      route,
      tagsStore,
      permissionStore,
      state
    }
  },
  mounted() {
    watch(reactive(this.route), this.onRouteChange)
    watch(() => this.state.visible, this.onVisibleChange)
    this.initTags()
    this.addTags()
  },
  computed: {
    visitedViews(): ITagView[] {
      return this.tagsStore.visitedViews
    },
    routes(): RouteRecordRaw[] {
      return this.permissionStore.routes
    }
  },
  methods: {
    onRouteChange() {
      this.addTags()
      this.moveToCurrentTag()
    },
    onVisibleChange(value: boolean) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    isActive(route: ITagView) {
      return route.path === this.$route.path
    },

    isAffix(tag: ITagView) {
      return tag.meta && tag.meta.affix
    },

    filterAffixTags(routes: RouteRecordRaw[], basePath = '/') {
      let tags: ITagView[] = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const childTags = this.filterAffixTags(route.children, route.path)
          if (childTags.length >= 1) {
            tags = [...tags, ...childTags]
          }
        }
      })
      return tags
    },

    initTags() {
      this.state.affixTags = this.filterAffixTags(this.routes)
      for (const tag of this.state.affixTags) {
        // Must have tag name
        if (tag.name) {
          this.tagsStore.addVisitedView(tag)
        }
      }
    },

    addTags() {
      const route = this.route
      const { name } = route
      if (name) {
        this.tagsStore.addView(route as unknown as ITagView)
      }
      return false
    },

    moveToCurrentTag() {
      const tags = this.$refs.tag as any[] // TODO: better typescript support for router-link
      this.$nextTick(() => {
        for (const tag of tags) {
          if ((tag.to as ITagView).path === this.$route.path) {
            ;(this.$refs.scrollPane as typeof ScrollPane).moveToTarget(tag as any)
            // When query is different then update
            if ((tag.to as ITagView).fullPath !== this.$route.fullPath) {
              this.tagsStore.updateVisitedView(this.$route as ITagView)
            }
            break
          }
        }
      })
    },

    refreshSelectedTag(view: ITagView) {
      this.tagsStore.delCachedView(view)
      const { fullPath } = view
      this.$nextTick(() => {
        this.$router
          .replace({
            path: '/redirect' + fullPath
          })
          .catch((err) => {
            console.warn(err)
          })
      })
    },

    closeSelectedTag(view: ITagView) {
      this.tagsStore.delView(view)
      if (this.isActive(view)) {
        this.toLastView(this.tagsStore.visitedViews, view)
      }
    },

    closeOthersTags() {
      if (
        this.state.selectedTag.fullPath !== this.$route.path &&
        this.state.selectedTag.fullPath !== undefined
      ) {
        this.$router.push(this.state.selectedTag.fullPath).catch((err) => {
          console.warn(err)
        })
      }
      this.tagsStore.delOthersViews(this.state.selectedTag)
      this.moveToCurrentTag()
    },

    closeAllTags(view: ITagView) {
      this.tagsStore.delAllViews()
      if (this.state.affixTags.some((tag) => tag.path === this.$route.path)) {
        return
      }
      this.toLastView(this.tagsStore.visitedViews, view)
    },

    toLastView(visitedViews: ITagView[], view: ITagView) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView !== undefined && latestView.fullPath !== undefined) {
        this.$router.push(latestView.fullPath).catch((err) => {
          console.warn(err)
        })
      } else {
        // Default redirect to the home page if there is no tags-view, adjust it if you want
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath }).catch((err) => {
            console.warn(err)
          })
        } else {
          this.$router.push('/').catch((err) => {
            console.warn(err)
          })
        }
      }
    },

    openMenu(tag: ITagView, e: MouseEvent) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = (this.$el as HTMLElement).offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right
      if (left > maxLeft) {
        this.state.left = maxLeft
      } else {
        this.state.left = left
      }
      this.state.top = e.clientY
      this.state.visible = true
      this.state.selectedTag = tag
    },

    closeMenu() {
      this.state.visible = false
    },

    handleScroll() {
      this.closeMenu()
    }
  }
})
</script>

<style lang="scss">
// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: -2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      margin-left: 8px;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
