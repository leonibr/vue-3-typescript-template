<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1"
          class="no-redirect"
          >{{ $t('route.' + item.meta!.title) }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ $t('route.' + item.meta!.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { compile } from 'path-to-regexp'
import { type RouteRecordRaw, type RouteLocationMatched } from 'vue-router'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'BreadCrumb',
  setup() {
    const breadcrumbs: RouteRecordRaw[] = []

    return {
      breadcrumbs
    }
  },
  created() {
    const isPathOk = ref(this.$route.path.startsWith('/redirect/'))
    watch(isPathOk, (isTrue) => {
      if (isTrue) return
      this.getBreadcrumb()
    })
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
      const first = matched[0]
      if (!this.isDashboard(first)) {
        matched = [
          { path: '/dashboard', meta: { title: 'dashboard' } } as unknown as RouteLocationMatched
        ].concat(matched)
      }
      this.breadcrumbs = matched.filter((item) => {
        return item.meta && item.meta.title && item.meta.breadcrumb !== false
      })
    },

    isDashboard(route: RouteRecordRaw) {
      const name = route && route.name?.toString()
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },

    pathCompile(path: string) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      const toPath = compile(path)
      return toPath(params)
    },

    handleLink(item: any) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect).catch((err) => {
          console.warn(err)
        })
        return
      }
      this.$router.push(this.pathCompile(path)).catch((err) => {
        console.warn(err)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
