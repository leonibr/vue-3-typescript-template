<template>
  <div id="header-search" :class="{ show: show }" class="header-search">
    <icon class="search-icon" :data="searchSvg" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="(item.meta!.title as string[]).join(' > ')"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import path from 'path-browserify'
import Fuse from 'fuse.js' // A lightweight fuzzy-search module
import i18n from '@/lang' // Internationalization
import { defineComponent, watch, ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores/app-store'
import { usePermissionStore } from '@/stores/permission'
import searchSvg from '@/icons/svg/search.svg'
import type { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'HeaderSearch',
  setup() {
    const appStore = useAppStore()
    const permissionStore = usePermissionStore()
    const searchPool = reactive<RouteRecordRaw[]>([])
    const options = reactive<RouteRecordRaw[]>([])
    const show = ref(false)
    const search = ref('')
    let fuse: Fuse<RouteRecordRaw> | undefined
    return {
      appStore,
      permissionStore,
      searchPool,
      search,
      options,
      show,
      fuse,
      searchSvg
    }
  },
  created() {
    watch(ref(this.lang), this.updatePool)
    watch(ref(this.routes), this.updatePool)
    watch(reactive(this.searchPool), (values) => this.initFuse(values))
    watch(ref(this.show), this.onShowChange)
    onMounted(this.updatePool)
  },
  computed: {
    routes() {
      return this.permissionStore.routes
    },
    lang() {
      return this.appStore.language
    }
  },
  methods: {
    querySearch(query: string) {
      if (query !== '') {
        if (this.fuse) {
          this.options = this.fuse.search(query).map((result) => result.item)
        }
      } else {
        this.options = []
      }
    },
    change(route: RouteRecordRaw) {
      this.$router.push(route.path).catch((err) => {
        console.warn(err)
      })
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).blur()
      this.options = []
      this.show = false
    },
    onShowChange(value: boolean) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    },
    initFuse(list: RouteRecordRaw[]) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: 'title',
            weight: 0.7
          },
          {
            name: 'path',
            weight: 0.3
          }
        ]
      })
    },
    updatePool() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes: RouteRecordRaw[], basePath = '/', prefixTitle: string[] = []) {
      let res: RouteRecordRaw[] = []

      for (const router of routes) {
        // skip hidden router
        if (router.meta && router.meta.hidden) {
          continue
        }

        const data: RouteRecordRaw = {
          path: path.resolve(basePath, router.path),
          meta: {
            title: [...prefixTitle]
          }
        } as unknown as RouteRecordRaw

        if (router.meta && router.meta.title) {
          // generate internationalized title
          const i18ntitle = i18n.global.t(`route.${router.meta.title}`).toString()
          data.meta!.title = [...(data.meta!.title as string), i18ntitle]
          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(
            router.children,
            data.path,
            data.meta!.title as string[]
          )
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }
  }
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
