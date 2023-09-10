import { asyncRoutes, constantRoutes } from '@/router'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => (route.meta!.roles as unknown as string[]).includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state() {
    const _state: IPermissionState = {
      routes: [],
      dynamicRoutes: []
    }
    return _state
  },
  actions: {
    SET_ROUTES(routes: RouteRecordRaw[]) {
      this.routes = constantRoutes.concat(routes)
      this.dynamicRoutes = routes
    },
    generateRoutes(roles: string[]) {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      this.SET_ROUTES(accessedRoutes)
    }
  }
})
